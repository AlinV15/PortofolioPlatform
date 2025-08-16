package com.example.portofolio.dto;
// ===== SUPPORTING CLASSES =====

import java.util.Map;

/**
 * Project statistics DTO
 */
@lombok.Data
@lombok.Builder

public class ProjectStatisticsDto {
    private Long totalProjects;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> statusDistribution;
    private Long featuredCount;
    private Integer currentYear;
}