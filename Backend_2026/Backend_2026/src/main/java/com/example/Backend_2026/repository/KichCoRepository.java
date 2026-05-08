package com.example.Backend_2026.repository;

import com.example.Backend_2026.entity.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface KichCoRepository extends JpaRepository<KichCo, Long> {

    boolean existsByTen(String ten);
    boolean existsByTenAndIdNot(String ten, Long id);

    List<KichCo> findByDaXoaFalse();

}
