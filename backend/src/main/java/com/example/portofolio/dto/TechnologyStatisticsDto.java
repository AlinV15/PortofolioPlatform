package com.example.portofolio.dto;

import com.example.portofolio.service.base.ServiceUtils;

import java.util.Map;

@lombok.Data
@lombok.Builder
public class TechnologyStatisticsDto {
    private Long totalTechnologies;
    private Long trendingCount;
    private Double averagePopularityScore;
    private Map<String, Long> categoryDistribution;
    private Long recentlyReleasedCount;

    public Double getTrendingPercentage() {
        if (totalTechnologies == 0) return 0.0;
        return ServiceUtils.calculatePercentage(trendingCount, totalTechnologies);
    }

    public String getMostPopularCategory() {
        return ServiceUtils.findMostFrequent(
                categoryDistribution.keySet().stream()
                        .toList()
        ).orElse("Unknown");
    }
}