/*
 * ============================================================================
 * Archivo: ProductoRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Acceso a base de datos del catálogo oficial de la tienda (indumentaria, accesorios, entradas).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Soporta filtrado por estado activo y categoría para una navegación fluida en la tienda online.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();
    List<Producto> findByCategoria(String categoria);
}
