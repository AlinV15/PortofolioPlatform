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
public class ProjectExportDto {                 // Renamed
    private String id;                          // Long → String
    private String title;
    private String description;
    private String longDescription;
    private List<String> technologies;          // List<Technology> → List<String>
    private String category;
    private String status;                      // ProjectStatus → String
    private Boolean featured;                   // boolean → Boolean
    private List<String> images;                // String[] → List<String>
    private String demoUrl;
    private String githubUrl;
    private List<String> features;   // List<ProjectFeature> → DTO
    private List<String> challenges; // List<ProjectChallenge> → DTO
    private Double developmentTime;
    private String complexity;                  // ComplexityLevel → String
    private ProjectMetricsDto metrics;          // ProjectMetrics → DTO
    private List<String> tags;                  // String tags → List<String>
    private Integer year;
    private String primaryColor;
    private String secondaryColor;
}
