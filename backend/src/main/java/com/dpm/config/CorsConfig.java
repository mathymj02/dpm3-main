/*
 * ============================================================================
 * Archivo: CorsConfig.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura las políticas de CORS (Cross-Origin Resource Sharing). Define qué 
 * dominios externos (ej. frontend en React) pueden hacer peticiones a esta API.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Los navegadores web bloquean peticiones AJAX hacia dominios distintos al origen 
 * de la página web por motivos de seguridad. Configurar CORS explícitamente 
 * en Spring Boot permite que nuestro frontend en React (que corre en otro puerto
 * o dominio) se comunique sin errores de política de mismo origen.
 * ============================================================================
 */
package com.dpm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * @Configuration indica que es una clase de configuración estructural de Spring.
 */
@Configuration
public class CorsConfig {

    // Se inyecta la lista de orígenes permitidos desde application.yml (ej. http://localhost:5173)
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    /**
     * Crea y expone el filtro CORS que será interceptado por la cadena de seguridad HTTP.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite el uso de credenciales (cookies, headers de autorización) si fuera necesario
        config.setAllowCredentials(true);
        // Divide el string de application.yml en una lista separada por comas
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        // Headers requeridos por el frontend, especialmente 'Authorization' para el JWT
        config.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        // Métodos HTTP soportados
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Aplica esta política a todas las rutas de la API ("/**")
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
