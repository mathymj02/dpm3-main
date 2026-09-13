/*
 * ============================================================================
 * Archivo: JugadorController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Controlador REST para el CRUD de la plantilla de jugadores. Expone endpoints
 * públicos para ver jugadores y endpoints privados (solo ADMIN) para crear, editar o eliminar.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @PreAuthorize("hasRole('ADMIN')") se utiliza en los métodos de escritura (POST/PUT/DELETE)
 * para garantizar a nivel de método que solo administradores modifiquen la base de datos.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Separación de lectura y escritura: Los métodos GET están abiertos para todos los 
 *   visitantes de la web (configurados en SecurityConfig), mientras que las mutaciones están bloqueadas.
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.JugadorResponse;
import com.dpm.dto.MessageResponse;
import com.dpm.model.Jugador;
import com.dpm.service.JugadorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
public class JugadorController {

    private final JugadorService jugadorService;

    public JugadorController(JugadorService jugadorService) {
        this.jugadorService = jugadorService;
    }

    /**
     * Obtiene todo el plantel activo. (Acceso público)
     */
    @GetMapping
    public ResponseEntity<List<JugadorResponse>> getAll() {
        return ResponseEntity.ok(jugadorService.getAll());
    }

    /**
     * Obtiene el detalle de un jugador específico por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JugadorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jugadorService.getById(id));
    }

    /**
     * Filtra jugadores según su posición (PORTERO, DEFENSA, etc).
     */
    @GetMapping("/posicion/{posicion}")
    public ResponseEntity<List<JugadorResponse>> getByPosicion(@PathVariable String posicion) {
        return ResponseEntity.ok(jugadorService.getByPosicion(posicion));
    }

    /**
     * Crea un nuevo jugador.
     * @PreAuthorize restringe la ejecución únicamente a usuarios con rol ADMIN.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JugadorResponse> create(@Valid @RequestBody Jugador jugador) {
        // Retorna HTTP 201 Created
        return new ResponseEntity<>(jugadorService.create(jugador), HttpStatus.CREATED);
    }

    /**
     * Actualiza un jugador existente. Solo administradores.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JugadorResponse> update(@PathVariable Long id, @Valid @RequestBody Jugador jugador) {
        return ResponseEntity.ok(jugadorService.update(id, jugador));
    }

    /**
     * Elimina (o desactiva) a un jugador de la base de datos.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        jugadorService.delete(id);
        // MessageResponse es un DTO simple para devolver texto en formato JSON en vez de texto plano
        return ResponseEntity.ok(new MessageResponse("Jugador eliminado correctamente"));
    }
}
