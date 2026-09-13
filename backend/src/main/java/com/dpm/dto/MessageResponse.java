/*
 * ============================================================================
 * Archivo: MessageResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Transporta mensajes informativos o de confirmación de operaciones (ej: 'Compra exitosa', 'Producto eliminado').
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Estandariza respuestas JSON simples para retroalimentación visual amigable vía Toasts en React.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private String message;
}
