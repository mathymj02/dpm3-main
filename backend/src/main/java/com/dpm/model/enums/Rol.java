/*
 * ============================================================================
 * Archivo: Rol.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Enumera los roles del sistema utilizados por Spring Security para la autorización.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Se almacena como EnumType.ORDINAL en base de datos.
 * - USER (0) es un hincha/comprador. ADMIN (1) es un administrador del club.
 * ============================================================================
 */
package com.dpm.model.enums;

public enum Rol {
    USER,
    ADMIN,
    GUARDIA
}
