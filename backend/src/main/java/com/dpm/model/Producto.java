/*
 * ============================================================================
 * Archivo: Producto.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa la entidad fundamental del catálogo de merchandising de la tienda
 * del club (camisetas, entradas, etc). Define datos vitales como el precio, 
 * stock disponible y su categoría.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * JPA permite transformar esta clase Java a una tabla física `producto` en PostgreSQL/H2.
 * Las anotaciones de validación (como nullable = false) imponen restricciones 
 * desde la capa de la base de datos.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Precio en Integer: Todo el sistema usa Pesos Chilenos (CLP) como moneda.
 *   El peso chileno no tiene decimales en transacciones modernas, y usar `Integer` 
 *   previene los típicos errores de precisión de punto flotante de los `Double`.
 * - Flag 'activo' (Soft Delete): En un sistema e-commerce/contable no se borran 
 *   los productos con DROP/DELETE, ya que destruirían las compras históricas ligadas a ellos.
 *   Se usa un flag booleano para esconderlos de la vista (activo = false).
 * ============================================================================
 */
package com.dpm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    // Moneda CLP, siempre entera, evitando Double.
    @Column(nullable = false)
    private Integer precio;

    @Column(name = "imagen_url")
    private String imagenUrl;

    // Inventario disponible para la venta
    @Column(nullable = false)
    private Integer stock;

    // Agrupación visual en el catálogo (ej: "Indumentaria", "Entradas")
    @Column(nullable = false)
    private String categoria;

    // Borrado lógico. True = a la venta, False = oculto
    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Automatiza el registro de la fecha de creación inicial.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
