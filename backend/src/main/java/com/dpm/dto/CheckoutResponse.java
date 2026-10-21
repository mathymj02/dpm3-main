/*
 * ============================================================================
 * Archivo: CheckoutResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
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
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String message;
    private String numeroOrden;
    private Integer total;
    private String estado;
    private String direccionEnvio;
    private String numeroSeguimiento;
    private String metodoEntrega;
    private List<OrdenItemResponse> items;
    private List<EntradaResponse> tickets;
}
