/*
 * ============================================================================
 * Archivo: Jugador.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa a un jugador del plantel oficial del club.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Utiliza JPA (@Entity) para el mapeo a base de datos y Lombok para el código 
 * repetitivo. El uso del enum PosicionJugador asegura integridad de datos en Java.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Flag 'activo' (Soft Delete): Permite dar de baja a un jugador (por salida o retiro)
 *   sin destruir su registro histórico de la base de datos.
 * ============================================================================
 */
package com.dpm.model;

import com.dpm.model.enums.PosicionJugador;
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
@Table(name = "jugador")
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String nacionalidad;

    // Se persiste como número ordinal (0=PORTERO, 1=DEFENSA, etc.)
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private PosicionJugador posicion;

    private Integer edad;

    @Column(name = "foto_url")
    private String fotoUrl;

    // Aumentamos el largo por defecto de 255 a 500 para pequeñas biografías
    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo;
}
