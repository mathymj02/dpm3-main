/*
 * ============================================================================
 * Archivo: Orden.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa una compra consolidada efectuada por un hincha o socio del club.
 * Almacena el número de orden oficial, monto total, estado del despacho,
 * seguimiento de courier y su relación con los ítems adquiridos.
 * ============================================================================
 */
package com.dpm.model;

import com.dpm.model.enums.EstadoOrden;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_orden", nullable = false, unique = true, length = 50)
    private String numeroOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Integer total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private EstadoOrden estado = EstadoOrden.PAGADA;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrdenItem> items = new ArrayList<>();

    @Column(name = "direccion_envio", length = 250)
    private String direccionEnvio;

    @Column(name = "numero_seguimiento", length = 50)
    private String numeroSeguimiento;

    @Column(name = "metodo_entrega", length = 100)
    private String metodoEntrega;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
