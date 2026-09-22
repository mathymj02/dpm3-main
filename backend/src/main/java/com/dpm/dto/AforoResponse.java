package com.dpm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AforoResponse {
    private long ingresados;
    private long capacidadTotal;
    private double porcentajeOcupacion;
    private long entradasEmitidas;
    private long recaudacionTotal;
    private String estadoCapacidad; // NORMAL, MODERADO, LLENO
}
