package com.example.server.service;

import com.example.server.dao.BrandDao;
import com.example.server.dao.impl.BrandDaoImpl;
import com.example.server.dto.brand.BrandResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Brand;

import java.util.List;
import java.util.stream.Collectors;

public class BrandService {
    private final BrandDao brandDao = new BrandDaoImpl();

    public List<BrandResponse> getAllBrands() {
        return brandDao.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Brand not found with id: " + id));
        return convertToResponse(brand);
    }

    public BrandResponse createBrand(Brand brand) {
        brandDao.save(brand);
        return convertToResponse(brand);
    }

    public BrandResponse updateBrand(Long id, Brand updatedDetails) {
        Brand brand = brandDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Brand not found with id: " + id));
        brand.setName(updatedDetails.getName());
        brand.setLogoUrl(updatedDetails.getLogoUrl());
        brand.setDescription(updatedDetails.getDescription());
        brandDao.update(brand);
        return convertToResponse(brand);
    }

    public void deleteBrand(Long id) {
        boolean deleted = brandDao.deleteById(id);
        if (!deleted) {
            throw new AppException("Brand not found with id: " + id);
        }
    }

    private BrandResponse convertToResponse(Brand brand) {
        BrandResponse res = new BrandResponse();
        res.setId(brand.getId());
        res.setName(brand.getName());
        res.setLogoUrl(brand.getLogoUrl());
        res.setDescription(brand.getDescription());
        return res;
    }
}