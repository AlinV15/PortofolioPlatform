package com.example.portofolio.dto;

import com.example.portofolio.service.base.ServiceUtils;

import java.util.Map;

@lombok.Data
@lombok.Builder
public class PersonalTechnologyStatsDto {
    private Long totalUsed;
    private Map<String, Long> categoryUsage;
    private Long trendingUsed;
    private String mostUsedCategory;
    private Long expertLevel;

    public Double getExpertisePercentage() {
        if (totalUsed == 0) return 0.0;
        return ServiceUtils.calculatePercentage(expertLevel, totalUsed);
    }
}