/*
 * ============================================================================
 * Archivo: RegisterRequest.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Recibe nombre, email y contraseña en texto plano para su posterior validación y hashing en el servidor.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Valida los campos con Bean Validation (@NotBlank, @Email, @Size) antes de llegar a la lógica de negocio.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón DTO.
 * ============================================================================
 */
package com.dpm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    @NotBlank(message = "El email es requerido")
    @Email(message = "Debe ser un email válido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
}
