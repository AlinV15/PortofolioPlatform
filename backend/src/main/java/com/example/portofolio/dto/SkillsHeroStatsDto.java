package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillsHeroStatsDto {

    // Pentru text principal
    private String description;
    private String projectsText;
    private String technologiesText;

    // Pentru statistici numerice
    private String yearsCoding;
    private String projects;
    private String certifications;
    private String avgProficiency;

    // Pentru customizare avansată
    private String yearsCodingLabel;
    private String projectsLabel;
    private String certificationsLabel;
    private String avgProficiencyLabel;
}