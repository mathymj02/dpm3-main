/*
 * ============================================================================
 * Archivo: JugadorResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Envía la información pública de un jugador (nombre, posición, edad, foto, estadísticas).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Oculta campos técnicos de infraestructura de base de datos exponiendo solo lo necesario para el UI.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JugadorResponse {
    private Long id;
    private String nombre;
    private String nacionalidad;
    private String posicion;
    private Integer edad;
    private String fotoUrl;
    private String descripcion;
    private Boolean activo;
}
