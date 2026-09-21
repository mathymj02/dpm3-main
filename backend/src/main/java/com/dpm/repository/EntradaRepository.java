package com.dpm.repository;

import com.dpm.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {

    Optional<Entrada> findByCodigo(String codigo);

    long countByEstado(String estado);
}
