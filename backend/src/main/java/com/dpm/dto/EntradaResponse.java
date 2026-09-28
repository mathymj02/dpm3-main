/*
 * ============================================================================
 * Archivo: EntradaResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 */
package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntradaResponse {
    private Long id;
    private String codigo;
    private String tipo;
    private String partido;
    private String sector;
    private String puertaAsignada;
    private String asiento;
    private String titular;
    private String rut;
    private Integer precio;
}
