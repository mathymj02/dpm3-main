/*
 * ============================================================================
 * Archivo: CarritoRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Persistencia y recuperación de carritos según usuario y estado actual.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Garantiza integridad referencial y aislamiento del carrito de cada cliente autenticado.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Carrito;
import com.dpm.model.Usuario;
import com.dpm.model.enums.EstadoCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioAndEstado(Usuario usuario, EstadoCarrito estado);
}
