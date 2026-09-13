/*
 * ============================================================================
 * Archivo: UsuarioRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Capa de acceso a datos para la entidad Usuario. Provee métodos automáticos para buscar por email.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring Data JPA genera dinámicamente las consultas SQL preparadas seguras evitando SQL Injection y eliminando código boilerplate de JDBC.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository de DDD (Domain-Driven Design).
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
