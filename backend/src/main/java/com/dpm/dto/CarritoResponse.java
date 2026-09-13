/*
 * ============================================================================
 * Archivo: CarritoResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Estructura el carrito del cliente, listando sus ítems detallados y calculando el importe total en el servidor.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Evita que el cliente calcule el total localmente, mitigando fraudes en montos a pagar.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO con agregación.
 * ============================================================================
 */
package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarritoResponse {
    private Long id;
    private List<CarritoItemResponse> items;
    private Integer total;
}
