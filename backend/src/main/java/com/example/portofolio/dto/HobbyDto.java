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
public class HobbyDto {                     // Renamed
    private String id;                      // Long → String
    private String name;
    private String description;
    private String icon;                    // Icon → String
    private String category;                // HobbyCategory → String
    private Double yearsActive;             // years_active → yearsActive
    private String complexityLevel;         // ComplexityLevel → String
    private List<String> relatedSkills;     // List<Skill> → List<String>
    private String impactOnWork;            // ImpactLevel → String
    private String favoriteAspect;          // favorite_aspect → favoriteAspect
    private List<AchievementDto> achievements; // List<Achievement> → List<AchievementDto>
    private String primaryColor;
    private String secondaryColor;
}
