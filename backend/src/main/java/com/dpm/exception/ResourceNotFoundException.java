/*
 * ============================================================================
 * Archivo: ResourceNotFoundException.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa errores cuando un ID de jugador, producto, o noticia no existe en base de datos.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Permite que el GlobalExceptionHandler capture esta excepción y retorne automáticamente un código HTTP 404 estructurado en JSON.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Manejo de Excepciones Semántico en API REST.
 * ============================================================================
 */
package com.dpm.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
