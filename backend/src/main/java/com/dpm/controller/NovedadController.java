/*
 * ============================================================================
 * Archivo: NovedadController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Controlador REST para el blog de noticias del club. Permite a cualquier usuario 
 * leer las noticias y a los administradores publicar o editarlas.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Sigue el estándar REST con @RestController. La inyección automática del autor 
 * vía @AuthenticationPrincipal evita que un atacante envíe un ID de autor falso.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Auditoría en la creación: El servicio asocia automáticamente la novedad al 
 *   administrador que está logueado haciendo el request.
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.MessageResponse;
import com.dpm.dto.NovedadRequest;
import com.dpm.dto.NovedadResponse;
import com.dpm.model.Usuario;
import com.dpm.service.NovedadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/novedades")
public class NovedadController {

    private final NovedadService novedadService;

    public NovedadController(NovedadService novedadService) {
        this.novedadService = novedadService;
    }

    /**
     * Lista todas las noticias disponibles. Acceso público.
     */
    @GetMapping
    public ResponseEntity<List<NovedadResponse>> getAll() {
        return ResponseEntity.ok(novedadService.getAll());
    }

    /**
     * Obtiene una noticia específica para lectura detallada. Acceso público.
     */
    @GetMapping("/{id}")
    public ResponseEntity<NovedadResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(novedadService.getById(id));
    }

    /**
     * Crea una nueva noticia en el blog. 
     * Inyecta el @AuthenticationPrincipal para guardar quién escribió la noticia.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NovedadResponse> create(@Valid @RequestBody NovedadRequest request, 
                                                  @AuthenticationPrincipal Usuario autor) {
        return new ResponseEntity<>(novedadService.create(request, autor), HttpStatus.CREATED);
    }

    /**
     * Edita una noticia existente. Solo ADMIN.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NovedadResponse> update(@PathVariable Long id, @Valid @RequestBody NovedadRequest request) {
        return ResponseEntity.ok(novedadService.update(id, request));
    }

    /**
     * Elimina permanentemente una noticia del sistema. Solo ADMIN.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        novedadService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Novedad eliminada correctamente"));
    }
}
