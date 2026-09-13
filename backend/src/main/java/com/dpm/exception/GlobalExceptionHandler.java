/*
 * ============================================================================
 * Archivo: GlobalExceptionHandler.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Intercepta todas las excepciones no capturadas lanzadas por cualquier controlador
 * de la aplicación y las transforma en respuestas HTTP JSON estandarizadas.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @ControllerAdvice es un patrón de diseño fundamental en Spring Web. Permite
 * centralizar la lógica de manejo de errores en un solo lugar, manteniendo a los
 * controladores limpios de tediosos bloques `try-catch`.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Ocultar trazas (Stacktrace): Nunca se devuelve el stacktrace técnico al cliente
 *   (frontend/usuario), ya que expone detalles internos del servidor (vulnerabilidad).
 *   En su lugar, se devuelve un mapa clave-valor ("error": "Mensaje").
 * ============================================================================
 */
package com.dpm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * Escucha globalmente a todos los @RestController.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Intercepta cuando un recurso (ej. Jugador, Producto) no se encuentra en la BD.
     * Retorna HTTP 404 (Not Found).
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Intercepta errores lógicos de negocio (ej. "Stock insuficiente", "Email ya existe").
     * Retorna HTTP 400 (Bad Request).
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> handleBadRequestException(BadRequestException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Intercepta fallos de validación en DTOs (fallo en las anotaciones @Valid como @NotNull).
     * Devuelve una lista de todos los campos que fallaron.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        // Itera sobre todos los errores del request body y extrae el campo y su mensaje
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Intercepta fallos de autorización de Spring Security (ej. intentar acceder a @PreAuthorize("hasRole('ADMIN')") siendo USER).
     * Retorna HTTP 403 (Forbidden).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Acceso denegado.");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * CATCH-ALL: Captura cualquier otra excepción no manejada (NullPointerException, errores de base de datos críticos).
     * Retorna HTTP 500 para indicar un error del servidor, sin revelar los detalles de la falla al cliente.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Ha ocurrido un error interno del servidor.");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
