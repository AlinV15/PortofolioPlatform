package com.example.portofolio.dto;

import java.util.Map;

@lombok.Data
@lombok.Builder
public class SkillStatisticsDto {
    private Long totalSkills;
    private Double averageLevel;
    private Map<String, Long> proficiencyDistribution;
    private Long featuredCount;
    private Long trendingCount;
    private Long learningCount;
}
