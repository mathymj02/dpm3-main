/*
 * ============================================================================
 * Archivo: PosicionResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Expone las estadísticas de cada equipo en la tabla (PJ, PG, PE, PP, GF, GC, DG, Puntos).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Permite a React renderizar la tabla con orden garantizado y tipado estricto.
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
public class PosicionResponse {
    private Long id;
    private String equipo;
    private String escudoUrl;
    private Integer pj;
    private Integer pg;
    private Integer pe;
    private Integer pp;
    private Integer gf;
    private Integer gc;
    private Integer dg;
    private Integer pts;
    private Integer temporada;
}
