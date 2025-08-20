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
public class TimelineMilestoneDto {

    private String id;
    private String year;
    private String title;
    private String category;
    private String description;
    private List<String> technologies;
    private List<String> achievements;
    private String icon;
    private Boolean isActive;
    private Integer projectsCount;
    private Integer skillsLearned;
    private String duration;
    private String primaryColor;
    private String secondaryColor;
    private String importance;
    private String gradient;
    private String glowColor;
}