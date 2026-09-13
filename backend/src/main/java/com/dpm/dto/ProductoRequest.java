/*
 * ============================================================================
 * Archivo: ProductoRequest.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Transporta los datos enviados por el panel de administración al registrar o editar un producto.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Permite validar precios positivos y stock disponible en servidor.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequest {
    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    @NotNull(message = "El precio es requerido")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private Integer precio;

    private String imagenUrl;

    @NotNull(message = "El stock es requerido")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @NotBlank(message = "La categoría es requerida")
    private String categoria;
}
