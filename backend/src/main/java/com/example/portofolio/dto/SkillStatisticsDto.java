package com.example.portofolio.dto;

import java.util.Map;

/**
 * Skill statistics DTO
 */
@lombok.Data
@lombok.Builder
public class SkillStatisticsDto {
    private Long totalSkills;
    private Double averageLevel;
    private Map<String, Long> proficiencyDistribution;  // Changed from ProficiencyLevel to String
    private Long featuredCount;
    private Long trendingCount;
    private Long learningCount;
}
