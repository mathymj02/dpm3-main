/*
 * ============================================================================
 * Archivo: NovedadRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Permite consultar artículos ordenados cronológicamente de forma descendente.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring Data JPA infiere el ORDER BY fechaPublicacion DESC automáticamente sin necesidad de SQL manual.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Novedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NovedadRepository extends JpaRepository<Novedad, Long> {
    List<Novedad> findAllByOrderByFechaPublicacionDesc();
}
