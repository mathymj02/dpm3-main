/*
 * ============================================================================
 * Archivo: AuthController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el controlador REST que expone los endpoints para el registro y login de usuarios.
 * Recibe peticiones HTTP, las valida y las delega al AuthService.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @RestController facilita la creación de APIs, ya que automáticamente convierte 
 * las respuestas Java a formato JSON (vía Jackson) sin necesitar @ResponseBody extra.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - DTO Pattern: Se utilizan LoginRequest y RegisterRequest en vez de exponer o recibir
 *   directamente la entidad Usuario. Esto protege los datos internos y evita ataques 
 *   de "Mass Assignment".
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.AuthResponse;
import com.dpm.dto.LoginRequest;
import com.dpm.dto.RegisterRequest;
import com.dpm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @RestController marca esta clase como controlador donde todos los métodos devuelven datos JSON.
 * @RequestMapping define la ruta base para todos los endpoints de este archivo.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Inyección del servicio mediante constructor
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint público para iniciar sesión.
     * @PostMapping("/login") responde a peticiones POST en /api/auth/login.
     * @Valid asegura que los campos del request cumplan con las reglas (ej. NotNull).
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Devuelve 200 OK junto con el token JWT
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Endpoint público para registrar un nuevo usuario.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Devuelve 200 OK (podría ser 201 CREATED) junto con el nuevo token JWT
        return ResponseEntity.ok(authService.register(request));
    }
}
