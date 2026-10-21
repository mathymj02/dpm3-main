/*
 * ============================================================================
 * Archivo: EstadoOrden.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Define el ciclo de vida comercial y logístico de una orden de compra en el club.
 * ============================================================================
 */
package com.dpm.model.enums;

public enum EstadoOrden {
    PENDIENTE,
    PAGADA,
    EN_PREPARACION,
    DESPACHADA,
    ENTREGADA,
    CANCELADA
}
