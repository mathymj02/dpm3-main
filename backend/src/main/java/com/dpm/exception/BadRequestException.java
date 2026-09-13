/*
 * ============================================================================
 * Archivo: BadRequestException.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Indica violaciones de reglas de negocio como email duplicado, stock insuficiente o datos inválidos.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Mapea directamente al código HTTP 400 Bad Request con mensaje descriptivo para el cliente.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Manejo de Excepciones Semántico en API REST.
 * ============================================================================
 */
package com.dpm.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
