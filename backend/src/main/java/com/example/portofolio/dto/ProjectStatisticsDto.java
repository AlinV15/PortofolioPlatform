package com.example.portofolio.dto;


import java.util.Map;


@lombok.Data
@lombok.Builder

public class ProjectStatisticsDto {
    private Long totalProjects;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> statusDistribution;
    private Long featuredCount;
    private Integer currentYear;
}