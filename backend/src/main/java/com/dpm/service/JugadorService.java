/*
 * ============================================================================
 * Archivo: JugadorService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Concentra las reglas de negocio, validaciones y orquestación del plantel deportivo del club.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Separa la capa web (Controlador) de la capa de persistencia (Repositorio), aplicando Inversión de Control (IoC) y facilitando pruebas unitarias.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Service Layer / Capa de Negocio.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.JugadorResponse;
import com.dpm.exception.ResourceNotFoundException;
import com.dpm.model.Jugador;
import com.dpm.model.enums.PosicionJugador;
import com.dpm.repository.JugadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JugadorService {

    private final JugadorRepository jugadorRepository;

    public JugadorService(JugadorRepository jugadorRepository) {
        this.jugadorRepository = jugadorRepository;
    }

    public List<JugadorResponse> getAll() {
        return jugadorRepository.findByActivoTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JugadorResponse getById(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con ID: " + id));
        return mapToResponse(jugador);
    }

    public List<JugadorResponse> getByPosicion(String posicion) {
        try {
            PosicionJugador posEnum = PosicionJugador.valueOf(posicion.toUpperCase());
            return jugadorRepository.findByPosicion(posEnum).stream()
                    .filter(Jugador::getActivo)
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Posición no válida: " + posicion);
        }
    }

    public JugadorResponse create(Jugador jugador) {
        jugador.setActivo(true);
        Jugador saved = jugadorRepository.save(jugador);
        return mapToResponse(saved);
    }

    public JugadorResponse update(Long id, Jugador jugadorActualizado) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con ID: " + id));

        jugador.setNombre(jugadorActualizado.getNombre());
        jugador.setNacionalidad(jugadorActualizado.getNacionalidad());
        jugador.setPosicion(jugadorActualizado.getPosicion());
        jugador.setEdad(jugadorActualizado.getEdad());
        jugador.setFotoUrl(jugadorActualizado.getFotoUrl());
        jugador.setDescripcion(jugadorActualizado.getDescripcion());
        jugador.setActivo(jugadorActualizado.getActivo());

        Jugador saved = jugadorRepository.save(jugador);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jugador no encontrado con ID: " + id));
        jugador.setActivo(false);
        jugadorRepository.save(jugador);
    }

    private JugadorResponse mapToResponse(Jugador jugador) {
        return JugadorResponse.builder()
                .id(jugador.getId())
                .nombre(jugador.getNombre())
                .nacionalidad(jugador.getNacionalidad())
                .posicion(jugador.getPosicion().name())
                .edad(jugador.getEdad())
                .fotoUrl(jugador.getFotoUrl())
                .descripcion(jugador.getDescripcion())
                .activo(jugador.getActivo())
                .build();
    }
}
