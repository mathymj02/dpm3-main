/*
 * ============================================================================
 * Archivo: Carrito.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa la entidad del carrito de compras (cabecera del pedido).
 * Contiene la relación con el usuario dueño y una lista de los ítems que contiene.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se utiliza el mapeo objeto-relacional (JPA) para manejar la base de datos de manera orientada
 * a objetos, eliminando la necesidad de escribir SQL puro para las operaciones CRUD habituales.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Relación Jerárquica: Se usa CascadeType.ALL, lo que implica que el carrito "es dueño" de sus ítems.
 * - orphanRemoval = true: Si se quita un objeto CarritoItem de la lista `items`, Hibernate 
 *   lo borrará automáticamente de la tabla `carrito_item`.
 * - Estado del Carrito: El enum `EstadoCarrito` (ACTIVO, COMPLETADO) permite
 *   retener el historial de compras finalizadas sin borrar registros, útil para reportes.
 * ============================================================================
 */
package com.dpm.model;

import com.dpm.model.enums.EstadoCarrito;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carrito")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación de muchos carritos a un usuario. FetchType.LAZY mejora el rendimiento evitando cargar 
    // toda la entidad de usuario si no se requiere.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Se guarda como un número entero en BD basado en el orden del enum (ej. 0 = ACTIVO, 1 = COMPLETADO)
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private EstadoCarrito estado;

    // Un carrito tiene muchos ítems. El carrito controla el ciclo de vida (Cascade + OrphanRemoval).
    // Inicializado como ArrayList vacío por defecto para evitar NullPointerException.
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarritoItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Asigna la fecha actual automáticamente antes de la primera inserción en BD.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
