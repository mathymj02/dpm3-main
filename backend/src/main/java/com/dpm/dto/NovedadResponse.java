/*
 * ============================================================================
 * Archivo: NovedadResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa la noticia publicada, asociando el nombre del autor y la fecha formateada.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Optimiza la carga en el feed de noticias del portal institucional.
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

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NovedadResponse {
    private Long id;
    private String titulo;
    private String contenido;
    private String imagenUrl;
    private LocalDateTime fecha;
    private String autorNombre;
}
