/*
 * ============================================================================
 * Archivo: NovedadRequest.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Contiene el titular, cuerpo y URL de imagen de la novedad institucional enviada por el admin.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Protege contra inyecciones de payloads no autorizados en el gestor de contenidos.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NovedadRequest {
    @NotBlank(message = "El título es requerido")
    private String titulo;

    @NotBlank(message = "El contenido es requerido")
    private String contenido;

    private String imagenUrl;
}
