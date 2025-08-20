package com.example.portofolio.controller;
import com.example.portofolio.dto.CertificateDto;
import com.example.portofolio.dto.CertificateStatisticsDto;
import com.example.portofolio.dto.CertificationCategoryDto;

import com.example.portofolio.service.core.CertificateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class CertificateController {
    @Autowired
    private CertificateService certificateService;

    @GetMapping("/certificates")
    public ResponseEntity<List<CertificateDto>> getCertifications(
    ) {

        List<CertificateDto> body = certificateService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("Certifications", "value")
                .body(body);
    }

    @GetMapping("/certificates/categories")
    public ResponseEntity<List<CertificationCategoryDto>> getCertificationCategories(
    ) {

        List<CertificationCategoryDto> body = certificateService.getCertificationCategories();

        return ResponseEntity.ok()
                .header("CertificatesCategories", "value")
                .body(body);
    }

    @GetMapping("/certificates/stats")
    public ResponseEntity<CertificateStatisticsDto> getCertificationStats(
    ) {

        CertificateStatisticsDto body = certificateService.getCertificateStatistics(1L);

        return ResponseEntity.ok()
                .header("CertificatesStats", "value")
                .body(body);
    }


}
