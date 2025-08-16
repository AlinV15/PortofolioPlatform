package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pentru statisticile din hero section conform imaginii
 * "Computer Science Economics student with expertise in modern web technologies. 7+ projects built, 15 technologies mastered."
 * "3+ YEARS CODING | 7 PROJECTS | 3 CERTIFICATIONS | 68% AVG. PROFICIENCY"
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillsHeroStatsDto {

    // Pentru text principal
    private String description;              // "Computer Science Economics student with expertise in modern web technologies"
    private String projectsText;            // "7+ projects built"
    private String technologiesText;        // "15 technologies mastered"

    // Pentru statistici numerice
    private String yearsCoding;             // "3+"
    private String projects;                // "7"
    private String certifications;          // "3"
    private String avgProficiency;          // "68%"

    // Pentru customizare avansată
    private String yearsCodingLabel;        // "YEARS CODING"
    private String projectsLabel;           // "PROJECTS"
    private String certificationsLabel;     // "CERTIFICATIONS"
    private String avgProficiencyLabel;     // "AVG. PROFICIENCY"
}