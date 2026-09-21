package com.dpm.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidad: Entrada
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * Representa una entrada física o digital (E-Ticket) o credencial de socio
 * para el acceso a torniquetes en el Estadio Bicentenario Chinquihue.
 * Permite control antifraude y conteo de aforo oficial para Estadio Seguro.
 * ============================================================================
 */
@Entity
@Table(name = "entrada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String codigo;

    @Column(nullable = false, length = 50)
    private String tipo; // TICKET_PARTIDO, CARNET_SOCIO

    @Column(nullable = false, length = 150)
    private String partido;

    @Column(nullable = false, length = 100)
    private String sector;

    @Column(nullable = false, length = 50)
    private String puertaAsignada;

    @Column(length = 50)
    private String asiento;

    @Column(nullable = false, length = 100)
    private String titular;

    @Column(nullable = false, length = 20)
    private String rut;

    @Column(nullable = false, length = 30)
    private String estado; // VALIDA, INGRESADA, ANULADA, MOROSO

    private LocalDateTime fechaIngreso;

    @Column(length = 50)
    private String puertaIngreso;

    @Column(nullable = false)
    private Integer precio;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
