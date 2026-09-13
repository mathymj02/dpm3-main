/*
 * ============================================================================
 * Archivo: Posicion.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa una fila en la tabla de posiciones del campeonato. Guarda la
 * estadística de un equipo específico en una temporada.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Es una entidad plana (sin relaciones) optimizada para lecturas rápidas al
 * renderizar la tabla en el frontend.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Histórico por 'temporada': Se incluye el campo temporada para permitir 
 *   mantener un archivo histórico de años pasados sin borrar registros.
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
@Table(name = "posicion")
public class Posicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String equipo;

    @Column(name = "escudo_url")
    private String escudoUrl;

    @Column(nullable = false)
    private Integer pj; // Partidos Jugados

    @Column(nullable = false)
    private Integer pg; // Partidos Ganados

    @Column(nullable = false)
    private Integer pe; // Partidos Empatados

    @Column(nullable = false)
    private Integer pp; // Partidos Perdidos

    @Column(nullable = false)
    private Integer gf; // Goles a Favor

    @Column(nullable = false)
    private Integer gc; // Goles en Contra

    @Column(nullable = false)
    private Integer dg; // Diferencia de Goles

    @Column(nullable = false)
    private Integer pts; // Puntos Acumulados

    @Column(nullable = false)
    private Integer temporada; // Año (ej. 2025)
}
