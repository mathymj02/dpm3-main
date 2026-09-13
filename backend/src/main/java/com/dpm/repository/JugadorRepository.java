/*
 * ============================================================================
 * Archivo: JugadorRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Gestiona las operaciones de persistencia del plantel de jugadores (activos, filtrados por posición).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Consultas optimizadas autogeneradas por convención de nombres de Spring Data JPA, garantizando tipos seguros.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Jugador;
import com.dpm.model.enums.PosicionJugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {
    List<Jugador> findByActivoTrue();
    List<Jugador> findByPosicion(PosicionJugador posicion);
}
