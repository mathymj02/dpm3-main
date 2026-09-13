/*
 * ============================================================================
 * Archivo: AgregarItemRequest.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Transporta el identificador del producto y la cantidad deseada al agregar a la cesta.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Valida que la cantidad sea un entero positivo mayor a cero.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AgregarItemRequest {
    @NotNull(message = "El ID del producto es requerido")
    private Long productoId;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
}
