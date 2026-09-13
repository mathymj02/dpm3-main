/*
 * ============================================================================
 * Archivo: CarritoController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Expone la API para que un usuario interactúe con su propio carrito de compras 
 * (verlo, añadir ítems, quitarlos y proceder al pago).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @AuthenticationPrincipal extrae automáticamente al usuario autenticado (desde el JWT) 
 * inyectándolo en el método. Esto elimina la necesidad de pasar un "usuarioId" en 
 * el request JSON o buscarlo manualmente.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Seguridad Contextual: Todos los métodos aquí asumen que el usuario está logueado
 *   (requerido por SecurityConfig) y el carrito que modifican es estrictamente el suyo,
 *   garantizando la privacidad de las compras (Multi-tenancy).
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.AgregarItemRequest;
import com.dpm.dto.CarritoResponse;
import com.dpm.dto.MessageResponse;
import com.dpm.model.Usuario;
import com.dpm.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    /**
     * Obtiene el carrito activo del usuario logueado.
     * @AuthenticationPrincipal inyecta la entidad Usuario almacenada en el SecurityContext.
     */
    @GetMapping
    public ResponseEntity<CarritoResponse> getCarrito(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carritoService.getCarrito(usuario));
    }

    /**
     * Añade un producto o incrementa su cantidad en el carrito.
     */
    @PostMapping("/agregar")
    public ResponseEntity<CarritoResponse> agregarItem(@AuthenticationPrincipal Usuario usuario, 
                                                       @Valid @RequestBody AgregarItemRequest request) {
        return ResponseEntity.ok(carritoService.agregarItem(usuario, request));
    }

    /**
     * Remueve completamente un ítem del carrito, usando su ID interno (itemId).
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoResponse> eliminarItem(@AuthenticationPrincipal Usuario usuario, 
                                                        @PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(usuario, itemId));
    }

    /**
     * Finaliza la compra de los productos en el carrito activo, reduciendo el inventario.
     */
    @PostMapping("/checkout")
    public ResponseEntity<MessageResponse> checkout(@AuthenticationPrincipal Usuario usuario) {
        carritoService.checkout(usuario);
        return ResponseEntity.ok(new MessageResponse("Compra realizada con éxito"));
    }
}
