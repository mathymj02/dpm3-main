/*
 * ============================================================================
 * Archivo: ProductoResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Devuelve los atributos formateados de un producto para la tienda online y catálogo.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Permite formatear números y URLs antes de entregarlos al cliente React.
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
public class ProductoResponse {
    private Long id;
    private String nombre;
    private Integer precio;
    private String imagenUrl;
    private Integer stock;
    private String categoria;
    private Boolean activo;
    private LocalDateTime createdAt;
}
