/*
 * ============================================================================
 * Archivo: Usuario.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa la entidad 'Usuario' en la base de datos y a su vez implementa 
 * la interfaz UserDetails de Spring Security, fusionando el concepto de usuario
 * del negocio (email, nombre) con el usuario autenticado (roles, estado).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * @Entity de JPA (Hibernate) permite mapear esta clase directamente a la tabla `usuario`.
 * Utilizar Lombok (@Data, @Builder) elimina el código boilerplate (getters, setters).
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Contraseña hasheada (BCrypt): El campo se llama passwordHash explícitamente 
 *   para recordar que nunca almacena texto plano.
 * - UserDetails Integrado: Al implementar UserDetails, esta misma entidad puede
 *   ser devuelta por el UserDetailsService y guardada en el SecurityContext sin 
 *   necesidad de crear un DTO intermedio, simplificando la arquitectura.
 * - Auditoría Básica: @PrePersist establece automáticamente la fecha de creación.
 * ============================================================================
 */
package com.dpm.model;

import com.dpm.model.enums.Rol;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Anotaciones de Lombok para generar Getters, Setters, Equals, HashCode y Constructores.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * Indica que es una entidad persistente de la BD.
 */
@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    // El email es único y funciona como el "username" del sistema
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    // EnumType.ORDINAL guarda un número en BD (0 para USER, 1 para ADMIN, etc)
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Rol rol;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Hook de JPA que se ejecuta justo antes de insertar (INSERT) el registro por primera vez.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // =========================================================================
    // MÉTODOS DE LA INTERFAZ UserDetails (Spring Security)
    // =========================================================================

    /**
     * Traduce nuestro enum 'Rol' a los 'GrantedAuthority' que entiende Spring Security.
     * Se agrega el prefijo "ROLE_" porque es una convención estándar del framework.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (rol == null) {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    /**
     * Devuelve la contraseña para el proceso de validación.
     */
    @Override
    public String getPassword() {
        return passwordHash;
    }

    /**
     * Define el campo que se usa como nombre de usuario.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /*
     * Los siguientes métodos indican si la cuenta o las credenciales están 
     * expiradas, bloqueadas o deshabilitadas. Por defecto (MVP), retornan true.
     */

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
