/*
 * ============================================================================
 * Archivo: CarritoService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Contiene la lógica del carrito de compras:
 * - Creación y obtención del carrito activo del usuario.
 * - Adición de productos con validación de inventario.
 * - Eliminación de productos.
 * - Checkout atómico: Deducción de inventario, generación de Orden oficial,
 *   emisión persistente de Entradas/Tickets en BD y cierre del carrito.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring @Transactional garantiza consistencia ACID completa: si ocurre una
 * falla durante la deducción de inventario o generación de orden, se realiza un
 * rollback total previniendo inconsistencias en inventario o transacciones bancarias.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.*;
import com.dpm.exception.BadRequestException;
import com.dpm.exception.ResourceNotFoundException;
import com.dpm.model.*;
import com.dpm.model.enums.EstadoCarrito;
import com.dpm.model.enums.EstadoOrden;
import com.dpm.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final OrdenItemRepository ordenItemRepository;
    private final EntradaRepository entradaRepository;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoItemRepository carritoItemRepository,
                          ProductoRepository productoRepository,
                          OrdenRepository ordenRepository,
                          OrdenItemRepository ordenItemRepository,
                          EntradaRepository entradaRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.productoRepository = productoRepository;
        this.ordenRepository = ordenRepository;
        this.ordenItemRepository = ordenItemRepository;
        this.entradaRepository = entradaRepository;
    }

    /**
     * Busca el carrito ACTIVO actual del usuario. Si no existe, crea uno nuevo.
     */
    public Carrito getOrCreateCarrito(Usuario usuario) {
        Optional<Carrito> carritoOpt = carritoRepository.findByUsuarioAndEstado(usuario, EstadoCarrito.ACTIVO);
        
        if (carritoOpt.isPresent()) {
            return carritoOpt.get();
        }

        Carrito nuevoCarrito = Carrito.builder()
                .usuario(usuario)
                .estado(EstadoCarrito.ACTIVO)
                .build();

        return carritoRepository.save(nuevoCarrito);
    }

    /**
     * Agrega un producto al carrito de un usuario, verificando stock y precios.
     */
    @Transactional
    public CarritoResponse agregarItem(Usuario usuario, AgregarItemRequest request) {
        Carrito carrito = getOrCreateCarrito(usuario);
        
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + request.getProductoId()));

        if (!producto.getActivo()) {
            throw new BadRequestException("El producto seleccionado ya no está disponible para la venta.");
        }

        if (producto.getStock() < request.getCantidad()) {
            throw new BadRequestException("Stock insuficiente. Disponibles: " + producto.getStock());
        }

        Optional<CarritoItem> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (itemExistente.isPresent()) {
            CarritoItem item = itemExistente.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            if (producto.getStock() < nuevaCantidad) {
                throw new BadRequestException("No puedes añadir más unidades de las disponibles en inventario (" + producto.getStock() + ")");
            }
            item.setCantidad(nuevaCantidad);
            carritoItemRepository.save(item);
        } else {
            CarritoItem nuevoItem = CarritoItem.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(request.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();
            carritoItemRepository.save(nuevoItem);
            carrito.getItems().add(nuevoItem);
        }

        return getCarritoResponse(carrito);
    }

    /**
     * Elimina un ítem específico del carrito activo del usuario.
     */
    @Transactional
    public CarritoResponse eliminarItem(Usuario usuario, Long itemId) {
        Carrito carrito = getOrCreateCarrito(usuario);
        
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("El ítem no fue encontrado en el carrito."));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new BadRequestException("No tienes permisos para modificar este ítem.");
        }

        carrito.getItems().remove(item);
        carritoItemRepository.delete(item);

        return getCarritoResponse(carrito);
    }

    /**
     * Retorna el estado actual del carrito para ser consumido por el frontend (DTO).
     */
    @Transactional(readOnly = true)
    public CarritoResponse getCarrito(Usuario usuario) {
        return getCarritoResponse(getOrCreateCarrito(usuario));
    }

    /**
     * Finaliza la compra de los ítems en el carrito, deduciendo stock atómicamente,
     * persistiendo la Orden comercial y generando los e-tickets correspondientes en BD.
     * Si ocurre cualquier fallo o error en el proceso, se ejecuta ROLLBACK automático.
     */
    @Transactional(rollbackFor = Exception.class)
    public CheckoutResponse checkout(Usuario usuario) {
        Carrito carrito = getOrCreateCarrito(usuario);
        
        if (carrito.getItems().isEmpty()) {
            throw new BadRequestException("El carrito está vacío.");
        }

        // Doble validación: verificar stock de cada ítem antes del checkout definitivo
        for (CarritoItem item : carrito.getItems()) {
            Producto producto = item.getProducto();
            if (producto.getStock() < item.getCantidad()) {
                throw new BadRequestException("Stock insuficiente para el producto: " + producto.getNombre());
            }
            // Deducir el stock real
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);
        }

        // 1. Generar número de orden único y entidad Orden
        int year = LocalDateTime.now().getYear();
        String codigoSufijo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String numeroOrden = "ORD-" + year + "-" + codigoSufijo;
        String trackingCourier = "CHX-" + (100000 + (int)(Math.random() * 900000)) + "-CL";

        int totalOrden = carrito.getItems().stream()
                .mapToInt(item -> item.getPrecioUnitario() * item.getCantidad())
                .sum();

        Orden orden = Orden.builder()
                .numeroOrden(numeroOrden)
                .usuario(usuario)
                .total(totalOrden)
                .estado(EstadoOrden.PAGADA)
                .direccionEnvio("Av. Diego Portales 1240, Puerto Montt, Región de Los Lagos")
                .numeroSeguimiento(trackingCourier)
                .metodoEntrega("Chilexpress Courier Express")
                .build();

        Orden ordenGuardada = ordenRepository.save(orden);

        // 2. Persistir los ítems de la orden y generar tickets oficiales si corresponden
        List<OrdenItemResponse> ordenItemResponses = new ArrayList<>();
        List<EntradaResponse> ticketsGenerados = new ArrayList<>();

        for (CarritoItem item : carrito.getItems()) {
            Producto prod = item.getProducto();
            int subtotal = item.getPrecioUnitario() * item.getCantidad();

            OrdenItem ordenItem = OrdenItem.builder()
                    .orden(ordenGuardada)
                    .producto(prod)
                    .productoNombre(prod.getNombre())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();
            ordenItemRepository.save(ordenItem);

            ordenItemResponses.add(OrdenItemResponse.builder()
                    .id(ordenItem.getId())
                    .productoNombre(prod.getNombre())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build());

            // Si el ítem es una entrada o ticket para el Chinquihue, se emite formalmente en BD
            boolean esTicket = (prod.getCategoria() != null && prod.getCategoria().equalsIgnoreCase("Tickets"))
                    || prod.getNombre().toLowerCase().contains("entrada");

            if (esTicket) {
                for (int i = 0; i < item.getCantidad(); i++) {
                    String codigoTicket = "DPM-TKT-" + year + "-" + String.format("%04d", (int)(Math.random() * 9000 + 1000)) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
                    Entrada entrada = Entrada.builder()
                            .codigo(codigoTicket)
                            .tipo("TICKET_PARTIDO")
                            .partido("Deportes Puerto Montt vs Deportes Temuco")
                            .sector("Galería Sur - Los Hijos del Temporal")
                            .puertaAsignada("Puerta 2 - Acceso Principal")
                            .asiento("Sector B - Asiento " + (10 + (int)(Math.random() * 80)))
                            .titular(usuario.getNombre() != null ? usuario.getNombre() : "Hincha Albiverde")
                            .rut("18.492.301-8")
                            .estado("VALIDA")
                            .precio(item.getPrecioUnitario())
                            .build();

                    Entrada entradaGuardada = entradaRepository.save(entrada);

                    ticketsGenerados.add(EntradaResponse.builder()
                            .id(entradaGuardada.getId())
                            .codigo(entradaGuardada.getCodigo())
                            .tipo(entradaGuardada.getTipo())
                            .partido(entradaGuardada.getPartido())
                            .sector(entradaGuardada.getSector())
                            .puertaAsignada(entradaGuardada.getPuertaAsignada())
                            .asiento(entradaGuardada.getAsiento())
                            .titular(entradaGuardada.getTitular())
                            .rut(entradaGuardada.getRut())
                            .precio(entradaGuardada.getPrecio())
                            .build());
                }
            }
        }

        // Cerrar el carrito marcándolo como COMPLETADO
        carrito.setEstado(EstadoCarrito.COMPLETADO);
        carritoRepository.save(carrito);

        return CheckoutResponse.builder()
                .message("Compra realizada con éxito")
                .numeroOrden(ordenGuardada.getNumeroOrden())
                .total(ordenGuardada.getTotal())
                .estado(ordenGuardada.getEstado().name())
                .direccionEnvio(ordenGuardada.getDireccionEnvio())
                .numeroSeguimiento(ordenGuardada.getNumeroSeguimiento())
                .metodoEntrega(ordenGuardada.getMetodoEntrega())
                .items(ordenItemResponses)
                .tickets(ticketsGenerados)
                .build();
    }

    /**
     * Utilidad para mapear la entidad Carrito hacia su DTO representativo.
     */
    private CarritoResponse getCarritoResponse(Carrito carrito) {
        List<CarritoItemResponse> items = carrito.getItems().stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());

        Integer total = items.stream()
                .mapToInt(CarritoItemResponse::getSubtotal)
                .sum();

        return CarritoResponse.builder()
                .id(carrito.getId())
                .items(items)
                .total(total)
                .build();
    }

    /**
     * Convierte la entidad de BD CarritoItem a su versión ligera de transferencia (DTO).
     */
    private CarritoItemResponse mapToItemResponse(CarritoItem item) {
        return CarritoItemResponse.builder()
                .id(item.getId())
                .productoNombre(item.getProducto().getNombre())
                .precioUnitario(item.getPrecioUnitario())
                .cantidad(item.getCantidad())
                .subtotal(item.getPrecioUnitario() * item.getCantidad())
                .build();
    }
}
