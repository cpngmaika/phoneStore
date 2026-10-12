package com.example.server.dao;

import com.example.server.model.Brand;
import java.util.Optional;

public interface BrandDao extends GenericDao<Brand, Long> {
    Optional<Brand> findOptionalById(Long id);
    boolean deleteById(Long id);
}