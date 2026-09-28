/*
 * ============================================================================
 * Archivo: OrdenItemRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Repositorio Spring Data JPA para los ítems pertenecientes a cada orden.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Orden;
import com.dpm.model.OrdenItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenItemRepository extends JpaRepository<OrdenItem, Long> {
    List<OrdenItem> findByOrden(Orden orden);
}
