/*
 * ============================================================================
 * Archivo: JwtAuthFilter.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es un filtro que se ejecuta una vez por cada petición HTTP (OncePerRequestFilter).
 * Su trabajo es interceptar la petición, buscar el token JWT en las cabeceras, 
 * validarlo y, si es correcto, establecer la autenticación en el SecurityContext de Spring.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Un filtro de servlets es la forma estándar de interceptar peticiones en Java web.
 * Heredar de OncePerRequestFilter garantiza que la lógica de validación se ejecute 
 * exactamente una vez por cada solicitud al servidor, evitando procesamientos dobles.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Cadena de Filtros (Filter Chain): Si el token es inválido o no existe, el filtro 
 *   simplemente pasa la petición al siguiente eslabón. SecurityConfig luego decide si
 *   la ruta requería autenticación o no, devolviendo un 401 si era obligatoria.
 * ============================================================================
 */
package com.dpm.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * @Component lo registra como un bean de Spring, permitiendo inyectar JwtTokenProvider
 * y UserDetailsService.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Lógica principal del filtro.
     * Intercepta la petición, extrae el token, lo valida y loguea al usuario en el contexto.
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Obtener el token de la cabecera HTTP
        String token = getTokenFromRequest(request);

        // 2. Si existe el token y es criptográficamente válido
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            // 3. Obtener quién es el usuario
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            // 4. Cargar los detalles completos del usuario (roles, cuenta activa, etc) de la base de datos
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 5. Crear un objeto de autenticación de Spring Security
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null, // Credenciales (contraseña) no necesarias aquí
                    userDetails.getAuthorities() // Roles y permisos del usuario
            );

            // 6. Añadir detalles extra de la petición web (ej. dirección IP)
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // 7. Establecer este usuario como el usuario "actualmente logueado" para el resto del procesamiento
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        // 8. Continuar con el siguiente filtro en la cadena (o llegar al controlador si no hay más filtros)
        filterChain.doFilter(request, response);
    }

    /**
     * Método auxiliar para extraer la cadena JWT pura de la cabecera "Authorization".
     * El estándar dicta que el formato sea: "Bearer <token>"
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // Recorta los primeros 7 caracteres ("Bearer ") para devolver solo el token
            return bearerToken.substring(7);
        }
        return null; // Retorna null si no hay cabecera o está mal formateada
    }
}
