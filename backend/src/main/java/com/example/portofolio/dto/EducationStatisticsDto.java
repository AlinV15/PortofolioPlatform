package com.example.portofolio.dto;
// ===== SUPPORTING CLASSES =====

import com.example.portofolio.entity.enums.EducationLevel;

import java.util.Map;

/**
 * Education statistics DTO
 */
@lombok.Data
@lombok.Builder
public class EducationStatisticsDto {
    private Long totalEducation;
    private Long ongoingCount;
    private Long completedCount;
    private Map<String, Long> institutionDistribution;
    private Map<String, Long> fieldDistribution;
    private Map<EducationLevel, Long> levelDistribution;
    private Long featuredCount;
}