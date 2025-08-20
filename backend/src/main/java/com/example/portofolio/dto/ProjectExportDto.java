package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectExportDto {
    private String id;
    private String title;
    private String description;
    private String longDescription;
    private List<String> technologies;
    private String category;
    private String status;
    private Boolean featured;
    private List<String> images;
    private String demoUrl;
    private String githubUrl;
    private List<String> features;
    private List<String> challenges;
    private Double developmentTime;
    private String complexity;
    private ProjectMetricsDto metrics;
    private List<String> tags;
    private Integer year;
    private String primaryColor;
    private String secondaryColor;
}
