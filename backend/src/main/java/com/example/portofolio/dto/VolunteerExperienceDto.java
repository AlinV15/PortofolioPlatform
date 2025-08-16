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
public class VolunteerExperienceDto {           // Renamed
    private String id;                          // Long → String
    private String organization;
    private String role;
    private String period;
    private String location;
    private String type;                        // VolunteerType → String
    private String status;                      // VolunteerStatus → String
    private String description;
    private List<ResponsibilityDto> responsibilities; // List<VolunteerResponsibility> → DTO
    private List<AchievementDto> achievements;  // List<Achievement> → DTO
    private List<String> skillsGained;          // List<Skill> → List<String>
    private List<FeaturedProjectDto> projects;          // List<Project> → DTO
    private String impactLevel;                 // ImpactLevel → String
    private String icon;                        // Icon → String
    private String website;
    private String primaryColor;
    private String secondaryColor;
}
