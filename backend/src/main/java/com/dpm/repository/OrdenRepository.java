/*
 * ============================================================================
 * Archivo: OrdenRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Repositorio Spring Data JPA para la persistencia y consulta de órdenes de compra.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Orden;
import com.dpm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByUsuarioOrderByCreatedAtDesc(Usuario usuario);
    Optional<Orden> findByNumeroOrden(String numeroOrden);
}
