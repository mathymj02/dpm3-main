/*
 * ============================================================================
 * Archivo: PosicionService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Proporciona la clasificación oficial de los equipos del campeonato nacional.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Desacopla la lógica de ordenamiento y temporadas de la API REST.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Service Layer.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.PosicionResponse;
import com.dpm.model.Posicion;
import com.dpm.repository.PosicionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PosicionService {

    private final PosicionRepository posicionRepository;

    public PosicionService(PosicionRepository posicionRepository) {
        this.posicionRepository = posicionRepository;
    }

    public List<PosicionResponse> getByTemporada(Integer temporada) {
        return posicionRepository.findByTemporadaOrderByPtsDesc(temporada).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PosicionResponse mapToResponse(Posicion posicion) {
        return PosicionResponse.builder()
                .id(posicion.getId())
                .equipo(posicion.getEquipo())
                .escudoUrl(posicion.getEscudoUrl())
                .pj(posicion.getPj())
                .pg(posicion.getPg())
                .pe(posicion.getPe())
                .pp(posicion.getPp())
                .gf(posicion.getGf())
                .gc(posicion.getGc())
                .dg(posicion.getDg())
                .pts(posicion.getPts())
                .temporada(posicion.getTemporada())
                .build();
    }
}
