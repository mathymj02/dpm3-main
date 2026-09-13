/*
 * ============================================================================
 * Archivo: PosicionJugador.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Define el conjunto cerrado y tipado de posiciones reglamentarias en el campo de juego (PORTERO, DEFENSA, VOLANTE, DELANTERO).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Evita strings mágicos y errores ortográficos en base de datos. Permite filtrados eficientes y seguros en queries JPA y TypeScript.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón de Dominio: Value Object tipado.
 * ============================================================================
 */
package com.dpm.model.enums;

public enum PosicionJugador {
    PORTERO,
    DEFENSA,
    VOLANTE,
    DELANTERO
}
