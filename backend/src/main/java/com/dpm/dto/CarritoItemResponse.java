/*
 * ============================================================================
 * Archivo: CarritoItemResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa una unidad de compra: producto, cantidad, precio unitario y subtotal.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Garantiza consistencia contable en cada ítem visualizado en la vista de carrito.
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
public class CarritoItemResponse {
    private Long id;
    private String productoNombre;
    private Integer cantidad;
    private Integer precioUnitario;
    private Integer subtotal;
}
