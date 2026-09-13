/*
 * ============================================================================
 * Archivo: PosicionController.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Expone la tabla de posiciones del campeonato. Es una API de solo lectura (GET).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @RequestParam se usa para permitir el filtro opcional por año de temporada, 
 * demostrando flexibilidad en los endpoints REST sin crear múltiples rutas.
 * ============================================================================
 */
package com.dpm.controller;

import com.dpm.dto.PosicionResponse;
import com.dpm.service.PosicionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posiciones")
public class PosicionController {

    private final PosicionService posicionService;

    public PosicionController(PosicionService posicionService) {
        this.posicionService = posicionService;
    }

    /**
     * Retorna la tabla de posiciones ordenada.
     * Si el cliente no envía el parámetro '?temporada=X', asume '2025' por defecto.
     */
    @GetMapping
    public ResponseEntity<List<PosicionResponse>> getPosiciones(@RequestParam(defaultValue = "2025") Integer temporada) {
        return ResponseEntity.ok(posicionService.getByTemporada(temporada));
    }
}
