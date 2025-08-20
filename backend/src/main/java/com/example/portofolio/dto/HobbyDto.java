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
public class HobbyDto {
    private String id;
    private String name;
    private String description;
    private String icon;
    private String category;
    private Double yearsActive;
    private String complexityLevel;
    private List<String> relatedSkills;
    private String impactOnWork;
    private String favoriteAspect;
    private List<AchievementDto> achievements;
    private String primaryColor;
    private String secondaryColor;
}
