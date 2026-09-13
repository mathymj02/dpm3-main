/*
 * ============================================================================
 * Archivo: Novedad.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Representa una noticia o entrada de blog publicada en la página oficial del club.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * JPA mapea esto a la tabla `novedad`. La columna de contenido se fuerza a tipo 'TEXT' 
 * en SQL para soportar artículos largos, sobrepasando el límite de VARCHAR(255).
 * 
 * DECISIONES DE ARQUITECTURA:
 * - Relación ManyToOne con Usuario: Registra obligatoriamente qué administrador 
 *   creó la publicación, funcionando como una bitácora de autoría.
 * ============================================================================
 */
package com.dpm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "novedad")
public class Novedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    // Almacena párrafos de texto (como HTML o Markdown) sin límite de 255 caracteres.
    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDateTime fechaPublicacion;

    // El autor siempre es un registro de la tabla usuarios.
    // FetchType.LAZY evita cargar los datos del usuario si solo queremos leer el título de la noticia.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    /**
     * Si no se envía una fecha desde el cliente, asigna la fecha y hora de creación del servidor.
     */
    @PrePersist
    protected void onCreate() {
        if (fechaPublicacion == null) {
            fechaPublicacion = LocalDateTime.now();
        }
    }
}
