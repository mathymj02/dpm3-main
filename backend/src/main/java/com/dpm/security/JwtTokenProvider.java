/*
 * ============================================================================
 * Archivo: JwtTokenProvider.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Proveedor y manejador del ciclo de vida de los JSON Web Tokens (JWT). Se encarga de
 * crear un token tras un inicio de sesión exitoso, extraer datos del token, y validar 
 * criptográficamente la autenticidad del mismo.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se escogió la biblioteca JJWT de io.jsonwebtoken porque facilita enormemente
 * el cifrado, descifrado y validación de tokens estándar de la industria. Un token JWT 
 * nos permite asegurar endpoints de forma stateless, evitando el uso de estado en la RAM.
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Algoritmo: HMAC-SHA utilizado para la firma simétrica con clave secreta codificada en Base64.
 * - Parámetros externalizados: La clave secreta y la fecha de expiración se inyectan a partir
 *   del application.yml, permitiendo cambiarlas sin recompilar, una buena práctica en Doce Factor Apps.
 * ============================================================================
 */
package com.dpm.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * @Component marca esta clase como un Bean de Spring para poder inyectarlo en otros
 * componentes (por ejemplo, en el AuthService o el JwtAuthFilter).
 */
@Component
public class JwtTokenProvider {

    // Se lee de la propiedad 'jwt.secret' del archivo application.yml
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Se lee de la propiedad 'jwt.expiration' (tiempo en milisegundos)
    @Value("${jwt.expiration}")
    private long jwtExpirationDate;

    /**
     * Genera un nuevo JWT para un usuario recientemente autenticado.
     * @param userDetails objeto que contiene los datos del usuario logueado
     * @return El token en formato String listo para devolverse al cliente
     */
    public String generateToken(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        // Construcción del token: establecemos el "sujeto", fechas de creación y caducidad y firmamos.
        return Jwts.builder()
                .subject(username) // Habitualmente es el correo o nombre de usuario
                .issuedAt(new Date()) // Marca de tiempo actual
                .expiration(expireDate) // Cuándo caduca el token
                .signWith(key()) // Firma con la clave secreta
                .compact(); // Convierte en una cadena compacta, segura de transmitir
    }

    /**
     * Crea un objeto SecretKey criptográficamente válido a partir de nuestra cadena base64 secreta.
     */
    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    /**
     * Recupera el nombre de usuario (el "sujeto" del token).
     * Fundamental para saber quién está realizando la solicitud.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key()) // Verifica contra la clave secreta original
                .build()
                .parseSignedClaims(token) // Extrae los claims (datos almacenados) del token validado
                .getPayload()
                .getSubject(); // Devuelve el username guardado en `.subject()`
    }

    /**
     * Revisa si el token ha sido manipulado, si ha expirado, o si la firma es incorrecta.
     * @return true si es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parse(token); // Intentar parsearlo. Si falla, arrojará excepción.
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // El token expiró, la firma no coincide o está mal formado.
            return false;
        }
    }
}
