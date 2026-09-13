/*
 * ============================================================================
 * Archivo: UserDetailsServiceImpl.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Implementa la interfaz central de Spring Security (UserDetailsService) encargada
 * de cargar los datos de un usuario desde la base de datos durante el proceso 
 * de autenticación (login o validación de token).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring Security requiere conocer cómo extraer al usuario de tu fuente de datos
 * específica (en este caso, PostgreSQL vía JPA). Al implementar `UserDetailsService`, 
 * conectamos nuestra tabla `usuarios` nativamente con la maquinaria de Spring.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Se usa el correo electrónico (`email`) como nombre de usuario (`username`) 
 *   para efectos de autenticación, siguiendo estándares modernos de inicio de sesión.
 * - La entidad `Usuario` ya implementa la interfaz `UserDetails`, por lo que podemos 
 *   devolverla directamente sin necesidad de crear un objeto adaptador intermedio.
 * ============================================================================
 */
package com.dpm.security;

import com.dpm.model.Usuario;
import com.dpm.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * @Service indica que es un servicio de negocio de Spring, lo cual automáticamente
 * lo registra y lo hace disponible para inyectar (por ejemplo, en JwtAuthFilter).
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Busca al usuario en la base de datos por su email.
     * 
     * @param username El email del usuario (Spring lo llama internamente 'username')
     * @return El objeto UserDetails correspondiente
     * @throws UsernameNotFoundException Si no existe ningún usuario con ese email
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscamos usando Optional. Si no está, arrojamos excepción de Spring Security
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));

        // Retornamos nuestra entidad Usuario porque ya implementa UserDetails
        return usuario;
    }
}
