/*
 * ============================================================================
 * Archivo: LoginRequest.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Transporta las credenciales (email y contraseña) desde el formulario de login hacia el backend.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * El patrón DTO desacopla la estructura interna de la base de datos de la interfaz de red, evitando over-posting y fugas de información.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Data Transfer Object (DTO).
 * ============================================================================
 */
package com.dpm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Debe ser un email válido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
