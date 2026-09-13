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

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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
}
