/*
 * ============================================================================
 * Archivo: CarritoItem.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa la relación muchos a muchos entre Carrito y Producto, actuando como
 * la tabla detalle de una compra. 
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * En JPA, una relación genérica ManyToMany no permite guardar columnas adicionales.
 * Por eso, se descompone explícitamente en una entidad intermedia (esta clase) con 
 * dos relaciones ManyToOne.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - precioUnitario: Es un E-commerce Pattern fundamental. Se clona el precio actual 
 *   del Producto hacia el CarritoItem en el momento en que el usuario lo agrega. 
 *   Esto previene que si el administrador sube el precio del Producto mañana, 
 *   la orden o factura del cliente de hoy se vea alterada retroactivamente.
 * ============================================================================
 */
package com.dpm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carrito_item")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación obligatoria hacia el Carrito "padre". FetchType.LAZY por rendimiento.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrito_id", nullable = false)
    private Carrito carrito;

    // Relación obligatoria hacia el producto específico que se está comprando
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // Cantidad del producto seleccionado por el usuario (ej. 2 bufandas)
    @Column(nullable = false)
    private Integer cantidad;

    // Precio estático fijado en el momento exacto en que se agregó al carrito
    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;
}
