/*
 * ============================================================================
 * Archivo: ProductoController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Controlador que expone el catálogo de merchandising de la tienda. Permite a los
 * clientes listar productos y a los administradores gestionar el inventario.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se apoya en @RestController y DTOs (ProductoRequest/ProductoResponse) para
 * establecer una comunicación segura y estructurada con el frontend (React).
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Uso de ResponseEntity: Permite devolver códigos de estado HTTP precisos (200 OK, 
 *   201 CREATED) junto con el cuerpo JSON, cumpliendo con los estándares REST.
 * - Seguridad: Mutaciones protegidas a nivel de método con @PreAuthorize.
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.MessageResponse;
import com.dpm.dto.ProductoRequest;
import com.dpm.dto.ProductoResponse;
import com.dpm.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Lista todos los productos disponibles en la tienda. Público.
     */
    @GetMapping
    public ResponseEntity<List<ProductoResponse>> getAll() {
        return ResponseEntity.ok(productoService.getAll());
    }

    /**
     * Devuelve el detalle de un producto específico. Público.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getById(id));
    }

    /**
     * Agrega un nuevo producto al catálogo. Solo Administradores.
     * @Valid obliga a cumplir las reglas de ProductoRequest (ej. precio > 0)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> create(@Valid @RequestBody ProductoRequest request) {
        return new ResponseEntity<>(productoService.create(request), HttpStatus.CREATED);
    }

    /**
     * Modifica datos de un producto (como precio o stock). Solo Administradores.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> update(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.update(id, request));
    }

    /**
     * Elimina un producto. Solo Administradores.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Producto eliminado correctamente"));
    }
}
