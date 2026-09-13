/*
 * ============================================================================
 * Archivo: NovedadService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Gestiona la publicación y edición de novedades con auditoría del autor autenticado.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Garantiza que solo usuarios administradores puedan crear y editar comunicaciones del club.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Service Layer.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.NovedadRequest;
import com.dpm.dto.NovedadResponse;
import com.dpm.exception.ResourceNotFoundException;
import com.dpm.model.Novedad;
import com.dpm.model.Usuario;
import com.dpm.repository.NovedadRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NovedadService {

    private final NovedadRepository novedadRepository;

    public NovedadService(NovedadRepository novedadRepository) {
        this.novedadRepository = novedadRepository;
    }

    public List<NovedadResponse> getAll() {
        return novedadRepository.findAllByOrderByFechaPublicacionDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NovedadResponse getById(Long id) {
        Novedad novedad = novedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));
        return mapToResponse(novedad);
    }

    public NovedadResponse create(NovedadRequest request, Usuario autor) {
        Novedad novedad = Novedad.builder()
                .titulo(request.getTitulo())
                .contenido(request.getContenido())
                .imagenUrl(request.getImagenUrl())
                .fechaPublicacion(LocalDateTime.now())
                .autor(autor)
                .build();

        Novedad saved = novedadRepository.save(novedad);
        return mapToResponse(saved);
    }

    public NovedadResponse update(Long id, NovedadRequest request) {
        Novedad novedad = novedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));

        novedad.setTitulo(request.getTitulo());
        novedad.setContenido(request.getContenido());
        if (request.getImagenUrl() != null) {
            novedad.setImagenUrl(request.getImagenUrl());
        }

        Novedad saved = novedadRepository.save(novedad);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        if (!novedadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Novedad no encontrada con ID: " + id);
        }
        novedadRepository.deleteById(id);
    }

    private NovedadResponse mapToResponse(Novedad novedad) {
        return NovedadResponse.builder()
                .id(novedad.getId())
                .titulo(novedad.getTitulo())
                .contenido(novedad.getContenido())
                .imagenUrl(novedad.getImagenUrl())
                .fecha(novedad.getFechaPublicacion())
                .autorNombre(novedad.getAutor().getNombre())
                .build();
    }
}
