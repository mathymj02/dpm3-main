package com.dpm.service;

import com.dpm.dto.AforoResponse;
import com.dpm.dto.ValidarTicketRequest;
import com.dpm.dto.ValidarTicketResponse;
import com.dpm.model.Entrada;
import com.dpm.repository.EntradaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class EntradaService {

    private final EntradaRepository entradaRepository;
    private static final long CAPACIDAD_CHINQUIHUE = 10000;

    public EntradaService(EntradaRepository entradaRepository) {
        this.entradaRepository = entradaRepository;
    }

    @Transactional
    public ValidarTicketResponse validarEntrada(ValidarTicketRequest request) {
        if (request == null || request.getCodigo() == null || request.getCodigo().trim().isEmpty()) {
            return construirRespuestaRechazo("CODIGO_INEXISTENTE", "Código no proporcionado o vacío.", "Desconocido", "---", "---", "---");
        }

        String codigoLimpio = request.getCodigo().trim();
        String puerta = (request.getPuerta() != null && !request.getPuerta().isEmpty()) ? request.getPuerta() : "Puerta 2 - Galería Sur";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        Optional<Entrada> entradaOpt = entradaRepository.findByCodigo(codigoLimpio);

        if (entradaOpt.isPresent()) {
            Entrada entrada = entradaOpt.get();

            // 1. Antifraude: Control de Duplicidad Real
            if ("INGRESADA".equalsIgnoreCase(entrada.getEstado())) {
                String horaYaIngresado = entrada.getFechaIngreso() != null 
                        ? entrada.getFechaIngreso().format(formatter) 
                        : "previamente";
                return construirRespuestaRechazo(
                        "YA_UTILIZADO",
                        "ALERTA: Ticket ya utilizado a las " + horaYaIngresado + " por " + entrada.getPuertaIngreso() + ".",
                        entrada.getTitular(),
                        entrada.getRut(),
                        entrada.getSector(),
                        entrada.getPartido()
                );
            }

            // 2. Control de Socios Morosos
            if ("MOROSO".equalsIgnoreCase(entrada.getEstado())) {
                return construirRespuestaRechazo(
                        "SOCIO_MOROSO",
                        "Socio con cuota social pendiente. Regularizar en boletería del estadio.",
                        entrada.getTitular(),
                        entrada.getRut(),
                        entrada.getSector(),
                        entrada.getPartido()
                );
            }

            // 3. Acceso Exitoso: Actualizar en Base de Datos Real
            entrada.setEstado("INGRESADA");
            entrada.setFechaIngreso(LocalDateTime.now());
            entrada.setPuertaIngreso(puerta);
            entradaRepository.save(entrada);

            long aforoActual = entradaRepository.countByEstado("INGRESADA");
            double porcentaje = (double) aforoActual / CAPACIDAD_CHINQUIHUE * 100.0;

            return ValidarTicketResponse.builder()
                    .valido(true)
                    .estado("ACCESO_PERMITIDO")
                    .mensaje(entrada.getTipo().contains("SOCIO") 
                            ? "ACCESO LIBERADO • SOCIO AL DÍA (Temporada 2026)" 
                            : "ACCESO PERMITIDO • ENTRADA GENERAL")
                    .titular(entrada.getTitular())
                    .rut(entrada.getRut())
                    .sector(entrada.getSector())
                    .partido(entrada.getPartido())
                    .horaIngreso(entrada.getFechaIngreso().format(formatter))
                    .puertaIngreso(puerta)
                    .aforoActual(aforoActual)
                    .aforoMaximo(CAPACIDAD_CHINQUIHUE)
                    .porcentajeAforo(Math.round(porcentaje * 10.0) / 10.0)
                    .build();
        }

        // 4. Si el código no existe en la base de datos, rechazar acceso (Antifraude estricto)
        return construirRespuestaRechazo(
                "CODIGO_INEXISTENTE",
                "El código escaneado no pertenece a ninguna entrada o carnet oficial registrado en el club.",
                "Desconocido",
                "---",
                "---",
                "---"
        );
    }

    public AforoResponse obtenerAforo() {
        long ingresados = entradaRepository.countByEstado("INGRESADA");
        long emitidas = entradaRepository.count();
        Long recaudacion = entradaRepository.sumPrecioByEstado("INGRESADA");
        
        // Si nadie ha ingresado aún, mostramos la recaudación por entradas válidas vendidas
        if (recaudacion == null || recaudacion == 0L) {
            Long totalEmitido = entradaRepository.sumPrecioTotal();
            recaudacion = (totalEmitido != null) ? totalEmitido : 0L;
        }

        double porcentaje = (double) ingresados / CAPACIDAD_CHINQUIHUE * 100.0;
        String estado = porcentaje >= 90 ? "LLENO" : (porcentaje >= 60 ? "MODERADO" : "NORMAL");

        return AforoResponse.builder()
                .ingresados(ingresados)
                .capacidadTotal(CAPACIDAD_CHINQUIHUE)
                .porcentajeOcupacion(Math.round(porcentaje * 10.0) / 10.0)
                .entradasEmitidas(emitidas)
                .recaudacionTotal(recaudacion)
                .estadoCapacidad(estado)
                .build();
    }

    @Transactional
    public AforoResponse reiniciarAforo() {
        entradaRepository.resetearIngresos();
        return obtenerAforo();
    }

    private ValidarTicketResponse construirRespuestaRechazo(String estado, String mensaje, String titular, String rut, String sector, String partido) {
        long aforoActual = entradaRepository.countByEstado("INGRESADA");
        double porcentaje = (double) aforoActual / CAPACIDAD_CHINQUIHUE * 100.0;

        return ValidarTicketResponse.builder()
                .valido(false)
                .estado(estado)
                .mensaje(mensaje)
                .titular(titular)
                .rut(rut)
                .sector(sector)
                .partido(partido)
                .horaIngreso(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
                .puertaIngreso("---")
                .aforoActual(aforoActual)
                .aforoMaximo(CAPACIDAD_CHINQUIHUE)
                .porcentajeAforo(Math.round(porcentaje * 10.0) / 10.0)
                .build();
    }
}
