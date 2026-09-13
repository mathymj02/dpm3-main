/*
 * ============================================================================
 * Archivo: ProductoService.java
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Gestiona creación, actualización, control de stock y baja lógica de productos del club.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Asegura que los precios y disponibilidad sean validados en el servidor antes de impactar la base de datos.
 * 
 * DECISIONES DE ARQUITECTURA:
 * Patrón Service Layer.
 * ============================================================================
 */
package com.dpm.service;

import com.dpm.dto.ProductoRequest;
import com.dpm.dto.ProductoResponse;
import com.dpm.exception.ResourceNotFoundException;
import com.dpm.model.Producto;
import com.dpm.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoResponse> getAll() {
        return productoRepository.findByActivoTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductoResponse getById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return mapToResponse(producto);
    }

    public ProductoResponse create(ProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .precio(request.getPrecio())
                .imagenUrl(request.getImagenUrl())
                .stock(request.getStock())
                .categoria(request.getCategoria())
                .activo(true)
                .build();

        Producto saved = productoRepository.save(producto);
        return mapToResponse(saved);
    }

    public ProductoResponse update(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setStock(request.getStock());
        producto.setCategoria(request.getCategoria());

        Producto saved = productoRepository.save(producto);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private ProductoResponse mapToResponse(Producto producto) {
        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .precio(producto.getPrecio())
                .imagenUrl(producto.getImagenUrl())
                .stock(producto.getStock())
                .categoria(producto.getCategoria())
                .activo(producto.getActivo())
                .createdAt(producto.getCreatedAt())
                .build();
    }
}
