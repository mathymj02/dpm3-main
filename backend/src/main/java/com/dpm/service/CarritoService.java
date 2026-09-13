/*
 * ============================================================================
 * Archivo: CarritoService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Maneja el ciclo de vida del carrito de compras (e-commerce). Controla la
 * creación de carritos, adición/eliminación de productos y el proceso final de checkout.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * El patrón de diseño de Servicios (Service Layer) permite centralizar reglas de negocio
 * complejas, como la verificación de stock y el cálculo de subtotales, manteniendo
 * limpios a los controladores REST.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Carrito "Activo": Solo se mantiene un carrito en estado ACTIVO por usuario a la vez.
 * - Snapshot de precio: Se guarda el precio en CarritoItem al momento de agregar. Esto 
 *   sigue el estándar de e-commerce de proteger la compra contra cambios de precio en el futuro.
 * - Doble validación de stock: Se valida al momento de agregar al carrito y nuevamente
 *   justo antes del checkout para evitar condiciones de carrera si dos usuarios compran 
 *   el mismo producto simultáneamente.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.AgregarItemRequest;
import com.dpm.dto.CarritoItemResponse;
import com.dpm.dto.CarritoResponse;
import com.dpm.exception.BadRequestException;
import com.dpm.exception.ResourceNotFoundException;
import com.dpm.model.Carrito;
import com.dpm.model.CarritoItem;
import com.dpm.model.Producto;
import com.dpm.model.Usuario;
import com.dpm.model.enums.EstadoCarrito;
import com.dpm.repository.CarritoItemRepository;
import com.dpm.repository.CarritoRepository;
import com.dpm.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @Service marca esta clase como el componente encargado de la lógica comercial del carrito.
 */
@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoItemRepository carritoItemRepository,
                          ProductoRepository productoRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.productoRepository = productoRepository;
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
    public CarritoResponse agregarItem(Usuario usuario, AgregarItemRequest request) {
        Carrito carrito = getOrCreateCarrito(usuario);
        
        // Obtener la entidad Producto desde la BD
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado."));

        // Validar que el producto se pueda vender
        if (!producto.getActivo() || producto.getStock() < request.getCidad()) {
            throw new BadRequestException("Producto no disponible o stock insuficiente.");
        }

        // Buscar si el ítem ya existe en el carrito
        Optional<CarritoItem> existingItem = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Si ya existe, incrementar la cantidad comprobando el stock
            CarritoItem item = existingItem.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            if (nuevaCantidad > producto.getStock()) {
                throw new BadRequestException("Stock insuficiente.");
            }
            item.setCantidad(nuevaCantidad);
            carritoItemRepository.save(item);
        } else {
            // Si es nuevo, crear una instancia de CarritoItem (snapshot de precio incluido)
            CarritoItem nuevoItem = CarritoItem.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(request.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();
            carrito.getItems().add(nuevoItem);
            carritoItemRepository.save(nuevoItem);
        }

        return getCarritoResponse(carritoRepository.save(carrito));
    }

    /**
     * Elimina un ítem específico del carrito activo del usuario.
     */
    public CarritoResponse eliminarItem(Usuario usuario, Long itemId) {
        Carrito carrito = getOrCreateCarrito(usuario);
        
        CarritoItem itemToRemove = carrito.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado en el carrito."));

        carrito.getItems().remove(itemToRemove);
        carritoItemRepository.delete(itemToRemove);

        return getCarritoResponse(carritoRepository.save(carrito));
    }

    /**
     * Retorna el estado actual del carrito para ser consumido por el frontend (DTO).
     */
    public CarritoResponse getCarrito(Usuario usuario) {
        return getCarritoResponse(getOrCreateCarrito(usuario));
    }

    /**
     * Finaliza la compra de los ítems en el carrito, deduciendo stock.
     */
    public void checkout(Usuario usuario) {
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

        // Cerrar el carrito marcándolo como COMPLETADO
        carrito.setEstado(EstadoCarrito.COMPLETADO);
        carritoRepository.save(carrito);
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
     * Utilidad para mapear la entidad CarritoItem hacia su DTO calculando el subtotal de ese ítem.
     */
    private CarritoItemResponse mapToItemResponse(CarritoItem item) {
        int subtotal = item.getCantidad() * item.getPrecioUnitario();
        return CarritoItemResponse.builder()
                .id(item.getId())
                .productoNombre(item.getProducto().getNombre())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .subtotal(subtotal)
                .build();
    }
}
