/*
 * ============================================================================
 * Archivo: AuthResponse.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Devuelve al cliente el token JWT generado junto al perfil básico y rol del usuario logueado.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * El frontend almacena este token para firmar subsecuentes llamadas HTTP seguras en la cabecera Authorization.
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
public class AuthResponse {
    private String token;
    private String nombre;
    private String email;
    private String rol;
}
