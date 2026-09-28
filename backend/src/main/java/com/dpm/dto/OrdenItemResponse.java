/*
 * ============================================================================
 * Archivo: OrdenItemResponse.java
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
public class OrdenItemResponse {
    private Long id;
    private String productoNombre;
    private Integer cantidad;
    private Integer precioUnitario;
    private Integer subtotal;
}
