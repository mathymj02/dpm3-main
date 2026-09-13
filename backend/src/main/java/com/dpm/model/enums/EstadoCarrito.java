/*
 * ============================================================================
 * Archivo: EstadoCarrito.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Modela el ciclo de vida del carrito de compras (ACTIVO, COMPLETADO, CANCELADO).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Permite trazabilidad transaccional en e-commerce. Un usuario solo puede tener un carrito ACTIVO a la vez; al finalizar compra pasa a COMPLETADO.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón State Machine básica para e-commerce.
 * ============================================================================
 */
package com.dpm.model.enums;

public enum EstadoCarrito {
    ACTIVO,
    COMPLETADO,
    CANCELADO
}
