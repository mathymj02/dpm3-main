package com.dpm.controller;

import com.dpm.dto.AforoResponse;
import com.dpm.dto.ValidarTicketRequest;
import com.dpm.dto.ValidarTicketResponse;
import com.dpm.service.EntradaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    /**
     * Endpoint invocado por los lectores de torniquetes / pistolitas láser / app móvil de guardias.
     * Valida la entrada o carnet de socio en base de datos del servidor y actualiza el aforo.
     * Requiere que el operador cuente con rol GUARDIA o ADMIN.
     */
    @PostMapping("/validar")
    @PreAuthorize("hasAnyRole('GUARDIA', 'ADMIN')")
    public ResponseEntity<ValidarTicketResponse> validarTicket(@RequestBody ValidarTicketRequest request) {
        ValidarTicketResponse response = entradaService.validarEntrada(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Devuelve el aforo y la asistencia en vivo en el Estadio Chinquihue
     * utilizado para los paneles dirigenciales y Estadio Seguro (Acceso público).
     */
    @GetMapping("/aforo")
    public ResponseEntity<AforoResponse> obtenerAforo() {
        return ResponseEntity.ok(entradaService.obtenerAforo());
    }

    /**
     * Reinicia la asistencia a 0 para simulaciones o cierres de jornada deportiva.
     * Protegido estrictamente a nivel de rol: solo la directiva (ADMIN) puede ejecutarlo.
     */
    @PostMapping("/reiniciar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AforoResponse> reiniciarAforo() {
        return ResponseEntity.ok(entradaService.reiniciarAforo());
    }
}
