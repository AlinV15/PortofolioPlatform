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
public class FeaturedSkillDto {                 // Renamed
    private String id;                          // Long → String
    private String name;
    private Integer level;                      // Double → Integer (0-100)
    private String categoryName;                // SkillCategory cateogory → String
    private String icon;                        // Icon → String
    private String description;
    private Double yearsOfExperience;           // Integer → Double
    private String color;
    private List<String> projects;              // List<Project> → List<String> project names
    private String proficiency;
    private Boolean trending;
    private Boolean learning;
}
