package com.dpm.repository;

import com.dpm.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {

    Optional<Entrada> findByCodigo(String codigo);

    long countByEstado(String estado);

    @Query("SELECT COALESCE(SUM(e.precio), 0L) FROM Entrada e WHERE e.estado = :estado")
    Long sumPrecioByEstado(@Param("estado") String estado);

    @Query("SELECT COALESCE(SUM(e.precio), 0L) FROM Entrada e")
    Long sumPrecioTotal();

    @Modifying
    @Query("UPDATE Entrada e SET e.estado = 'VALIDA', e.fechaIngreso = null, e.puertaIngreso = null WHERE e.estado = 'INGRESADA'")
    void resetearIngresos();
}
