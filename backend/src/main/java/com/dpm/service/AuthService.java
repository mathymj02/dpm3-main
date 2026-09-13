/*
 * ============================================================================
 * Archivo: AuthService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Servicio que contiene la lógica de negocio para el registro y autenticación 
 * de usuarios. Valida datos, encripta contraseñas, interactúa con la BD y 
 * coordina la generación del token JWT.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Usar la capa de servicio (Service Layer Pattern) separa la lógica de negocio 
 * de los controladores web. Esto permite mantener los controladores (REST) limpios 
 * y manejar la lógica de transacciones y seguridad de forma centralizada.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - BCrypt: Se usa para el hasheo de contraseñas. Nunca se guardan en texto plano.
 * - Login automático tras registro: Devuelve un JWT inmediatamente tras un registro 
 *   exitoso, mejorando la experiencia de usuario (UX) sin requerir un login extra.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.AuthResponse;
import com.dpm.dto.LoginRequest;
import com.dpm.dto.RegisterRequest;
import com.dpm.exception.BadRequestException;
import com.dpm.model.Usuario;
import com.dpm.model.enums.Rol;
import com.dpm.repository.UsuarioRepository;
import com.dpm.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @Service marca esta clase como componente de lógica de negocio en Spring.
 */
@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Flujo de registro de un nuevo usuario en el sistema.
     * 
     * @param request DTO con datos de registro (nombre, email, password)
     * @return AuthResponse conteniendo el token JWT y los datos públicos del usuario
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Validar que el email no exista previamente
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("El email ya está registrado.");
        }

        // 2. Construir la entidad de usuario (Patrón Builder)
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                // Encriptar la contraseña usando BCrypt antes de persistir
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                // Asignar rol estándar por defecto
                .rol(Rol.USER) 
                .build();

        // 3. Guardar el nuevo usuario en la base de datos
        usuarioRepository.save(usuario);

        // 4. Iniciar sesión automáticamente (Login implícito)
        return login(new LoginRequest(request.getEmail(), request.getPassword()));
    }

    /**
     * Flujo de inicio de sesión de un usuario existente.
     * 
     * @param request DTO con credenciales (email y password)
     * @return AuthResponse con el token JWT recién generado
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Delegar a Spring Security la autenticación. 
        // Lanza excepción automáticamente si credenciales son inválidas.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Establecer usuario en el contexto de seguridad actual
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Extraer la entidad Usuario desde la autenticación confirmada
        Usuario usuario = (Usuario) authentication.getPrincipal();
        
        // 4. Generar el JWT para la sesión
        String token = jwtTokenProvider.generateToken(usuario);

        // 5. Retornar los datos al frontend (sin la contraseña, obviamente)
        return AuthResponse.builder()
                .token(token)
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .build();
    }
}
