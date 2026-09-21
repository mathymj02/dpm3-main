package com.dpm.controller;

import com.dpm.dto.AforoResponse;
import com.dpm.dto.ValidarTicketRequest;
import com.dpm.dto.ValidarTicketResponse;
import com.dpm.service.EntradaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    /**
     * Endpoint invocado por los lectores de torniquetes / pistolitas láser
     * Valida la entrada o carnet de socio en base de datos del servidor y actualiza el aforo.
     */
    @PostMapping("/validar")
    public ResponseEntity<ValidarTicketResponse> validarTicket(@RequestBody ValidarTicketRequest request) {
        ValidarTicketResponse response = entradaService.validarEntrada(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Devuelve el aforo y la asistencia en vivo en el Estadio Chinquihue
     * utilizado para los paneles dirigenciales y Estadio Seguro.
     */
    @GetMapping("/aforo")
    public ResponseEntity<AforoResponse> obtenerAforo() {
        return ResponseEntity.ok(entradaService.obtenerAforo());
    }
}
