package com.example.server.service;

import com.example.server.dao.WarrantyPolicyDao;
import com.example.server.dao.impl.WarrantyPolicyDaoImpl;
import com.example.server.dto.warranty.WarrantyPolicyRequest;
import com.example.server.dto.warranty.WarrantyPolicyResponse;
import com.example.server.exception.AppException;
import com.example.server.model.WarrantyPolicy;

import java.util.List;
import java.util.stream.Collectors;

public class WarrantyPolicyService {
    private final WarrantyPolicyDao warrantyPolicyDao = new WarrantyPolicyDaoImpl();

    public List<WarrantyPolicyResponse> getAllPolicies() {
        return warrantyPolicyDao.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public WarrantyPolicyResponse getPolicyById(Long id) {
        WarrantyPolicy policy = warrantyPolicyDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Warranty policy not found with id: " + id));
        return convertToResponse(policy);
    }

    public WarrantyPolicyResponse createPolicy(WarrantyPolicyRequest request) {
        WarrantyPolicy policy = new WarrantyPolicy(
                request.getName(),
                request.getDurationMonths(),
                request.getCoverage(),
                request.getExclusions(),
                request.getContactInfo()
        );
        warrantyPolicyDao.save(policy);
        return convertToResponse(policy);
    }

    public WarrantyPolicyResponse updatePolicy(Long id, WarrantyPolicyRequest request) {
        WarrantyPolicy policy = warrantyPolicyDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Warranty policy not found with id: " + id));

        policy.setName(request.getName());
        policy.setDurationMonths(request.getDurationMonths());
        policy.setCoverage(request.getCoverage());
        policy.setExclusions(request.getExclusions());
        policy.setContactInfo(request.getContactInfo());

        warrantyPolicyDao.update(policy);
        return convertToResponse(policy);
    }

    public void deletePolicy(Long id) {
        if (warrantyPolicyDao.findOptionalById(id).isEmpty()) {
            throw new AppException("Warranty policy not found with id: " + id);
        }
        if (warrantyPolicyDao.hasReferences(id)) {
            throw new AppException("Cannot delete this warranty policy because it is currently linked to one or more products.");
        }

        boolean deleted = warrantyPolicyDao.deleteById(id);
        if (!deleted) {
            throw new AppException("Failed to delete warranty policy with id: " + id);
        }
    }

    private WarrantyPolicyResponse convertToResponse(WarrantyPolicy policy) {
        WarrantyPolicyResponse res = new WarrantyPolicyResponse();
        res.setId(policy.getId());
        res.setName(policy.getName());
        res.setDurationMonths(policy.getDurationMonths());
        res.setCoverage(policy.getCoverage());
        res.setExclusions(policy.getExclusions());
        res.setContactInfo(policy.getContactInfo());
        return res;
    }
}