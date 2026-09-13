/*
 * ============================================================================
 * Archivo: PosicionRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Gestiona la tabla de la liga de Segunda División Profesional por temporada ordenada por puntos.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Entrega los datos ordenados directamente desde el motor de base de datos para renderizado instantáneo en el frontend.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Posicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PosicionRepository extends JpaRepository<Posicion, Long> {
    List<Posicion> findByTemporadaOrderByPtsDesc(Integer temporada);
}
