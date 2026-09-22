/*
 * ============================================================================
 * Archivo: SecurityConfig.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Configura la seguridad global de la aplicación mediante Spring Security. Define 
 * el encriptado de contraseñas, la gestión de sesiones sin estado, el manejo 
 * de CORS y desactiva CSRF. También configura los permisos por rutas (públicas vs. privadas).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring Security es el estándar de oro en ecosistemas Java/Spring para proteger
 * aplicaciones web. Centraliza la autenticación y autorización, mitigando riesgos
 * de seguridad. Se prefirió sobre soluciones manuales (como en PHP) por ser madura
 * y conectarse nativamente al contexto de Spring.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Estado Stateless (Sin estado): En APIs REST con JWT no guardamos la sesión en RAM del servidor.
 * - CSRF desactivado: Al no usar cookies de sesión (JSESSIONID) sino Authorization Headers (JWT), 
 *   el riesgo de CSRF desaparece.
 * - Separación de rutas: Las operaciones de sólo lectura suelen ser públicas.
 * ============================================================================
 */
package com.dpm.config;

import com.dpm.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @Configuration indica que esta clase provee Beans de configuración para el contenedor de Spring.
 * @EnableMethodSecurity permite usar anotaciones como @PreAuthorize a nivel de método en los controladores.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    /**
     * Inyección de dependencias mediante constructor. Recomendado por sobre @Autowired.
     */
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Define qué algoritmo se usará para encriptar las contraseñas.
     * BCrypt aplica un "salt" automático e iteraciones para resistir ataques de fuerza bruta.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Expone el AuthenticationManager (manejador de autenticaciones de Spring) como Bean 
     * para usarlo en AuthService durante el proceso de login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Configura la cadena de filtros de seguridad (Security Filter Chain).
     * Es el corazón de la configuración: intercepta cada petición HTTP.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactivar CSRF, innecesario con tokens JWT
                .csrf(AbstractHttpConfigurer::disable)
                // Habilitar CORS según la configuración externa
                .cors(cors -> cors.configure(http))
                // Indicar a Spring Security que no cree ni utilice sesiones (STATELESS)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Definir reglas de autorización de rutas
                .authorizeHttpRequests(auth -> auth
                        // Endpoints de autenticación (login, registro) son 100% públicos
                        .requestMatchers("/api/auth/**").permitAll()
                        // Operaciones de lectura (GET) son públicas
                        .requestMatchers(HttpMethod.GET, "/api/jugadores/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/novedades/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posiciones/**").permitAll()
                        // Endpoints del sistema de torniquetes y aforo de estadio
                        .requestMatchers("/api/entradas/**").permitAll()
                        // Consola de base de datos H2, pública para depuración
                        .requestMatchers("/h2-console/**").permitAll()
                        // Cualquier otra petición (POST, PUT, DELETE) requiere estar autenticado
                        .anyRequest().authenticated()
                )
                // Configuración necesaria para poder renderizar la consola de H2 en un iframe
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); 

        // Inyectar nuestro filtro personalizado de JWT antes del filtro estándar de usuario/contraseña
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
