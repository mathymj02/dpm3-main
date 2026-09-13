/*
 * ============================================================================
 * Archivo: CarritoItemRepository.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Persiste cada línea de producto agregada a un carrito específico.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Relación One-To-Many administrada transparentemente por Hibernate JPA con claves foráneas adecuadas.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Repository.
 * ============================================================================
 */
package com.dpm.repository;

import com.dpm.model.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
}
