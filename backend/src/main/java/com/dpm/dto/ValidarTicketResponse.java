package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidarTicketResponse {
    private boolean valido;
    private String estado; // ACCESO_PERMITIDO, YA_UTILIZADO, SOCIO_MOROSO, CODIGO_INEXISTENTE
    private String mensaje;
    private String titular;
    private String rut;
    private String sector;
    private String partido;
    private String horaIngreso;
    private String puertaIngreso;
    private long aforoActual;
    private long aforoMaximo;
    private double porcentajeAforo;
}
