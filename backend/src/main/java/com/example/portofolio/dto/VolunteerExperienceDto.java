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
public class VolunteerExperienceDto {
    private String id;
    private String organization;
    private String role;
    private String period;
    private String location;
    private String type;
    private String status;
    private String description;
    private List<ResponsibilityDto> responsibilities;
    private List<AchievementDto> achievements;
    private List<String> skillsGained;
    private List<FeaturedProjectDto> projects;
    private String impactLevel;
    private String icon;
    private String website;
    private String primaryColor;
    private String secondaryColor;
}
