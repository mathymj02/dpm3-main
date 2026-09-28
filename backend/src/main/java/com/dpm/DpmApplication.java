/*
 * ============================================================================
 * Archivo: DpmApplication.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Es el punto de entrada principal (main) de la aplicación Spring Boot. 
 * Desde aquí se levanta el servidor embebido (Tomcat) y se inicializa el 
 * contexto de Spring (Inyección de Dependencias).
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Spring Boot elimina la necesidad de configurar servidores XML complejos o 
 * desplegar archivos .war externamente. Todo arranca con una simple clase Java.
 * ============================================================================
 */
package com.dpm;

import com.dpm.model.Usuario;
import com.dpm.model.enums.Rol;
import com.dpm.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * @SpringBootApplication es una anotación de conveniencia que encapsula:
 * - @Configuration: Indica que esta clase provee Beans.
 * - @EnableAutoConfiguration: Permite a Spring Boot configurar automáticamente cosas como la base de datos basándose en el pom.xml.
 * - @ComponentScan: Escanea todos los paquetes descendientes buscando @Controller, @Service, etc.
 */
@SpringBootApplication
public class DpmApplication {

    public static void main(String[] args) {
        // Ejecuta la aplicación y arranca el servidor web en el puerto configurado (8080)
        SpringApplication.run(DpmApplication.class, args);
    }

    /**
     * Sembrador inicial que crea el usuario Administrador del club solo si la cuenta no existe.
     * Respeta cambios posteriores de contraseña y auditoría, permitiendo además configurar la clave inicial
     * mediante la variable de entorno DPM_INITIAL_ADMIN_PASSWORD (default seguro: admin123 para desarrollo).
     */
    @Bean
    public CommandLineRunner initAdminUser(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByEmail("admin@dpm.cl").isEmpty()) {
                String initialPassword = System.getenv("DPM_INITIAL_ADMIN_PASSWORD");
                if (initialPassword == null || initialPassword.isBlank()) {
                    initialPassword = "admin123";
                }
                Usuario admin = Usuario.builder()
                        .nombre("Administrador DPM")
                        .email("admin@dpm.cl")
                        .passwordHash(passwordEncoder.encode(initialPassword))
                        .rol(Rol.ADMIN)
                        .build();
                usuarioRepository.save(admin);
            }
        };
    }
}
