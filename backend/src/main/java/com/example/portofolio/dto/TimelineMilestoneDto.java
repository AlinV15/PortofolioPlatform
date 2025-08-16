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

    private String id;                          // Achievement.id sau Project.id sau Education.id
    private String year;                        // Anul din achievementDate/completionDate/startDate
    private String title;                       // Achievement.title sau Project.title sau Education.degree
    private String category;                    // Mapped din entityType la enum
    private String description;                 // Achievement.description sau Project.description
    private List<String> technologies;          // Din EntityTechnology pentru entitatea respectivă
    private List<String> achievements;          // Sub-achievements sau features pentru proiecte
    private String icon;                        // Icon.name din EntityMetadata
    private Boolean isActive;                   // Pentru milestones curente (ex: ongoing education)
    private Integer projectsCount;              // Numărul de proiecte din acea perioadă
    private Integer skillsLearned;              // Numărul de skills învățate în perioada respectivă
    private String duration;                    // Durata calculată (ex: "6 months", "2 years")
    private String primaryColor;                // EntityMetadata.primaryColor
    private String secondaryColor;              // EntityMetadata.secondaryColor
    private String importance;                  // EntityMetadata.importance.toLowerCase()
    private String gradient;                    // EntityMetadata.gradient
    private String glowColor;                   // EntityMetadata.glowColor
}