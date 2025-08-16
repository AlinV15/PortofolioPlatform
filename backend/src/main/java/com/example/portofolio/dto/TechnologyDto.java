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
public class TechnologyDto {

    private String id;                      // Technology.id.toString()
    private String name;                    // Technology.name
    private String category;                // Mapped din TechnologyCategory.name la enum
    private String proficiency;             // Din EntityTechnology.proficiency.toLowerCase()
    private Integer level;                  // Calculat din proficiency (beginner=25, intermediate=50, etc.)
    private Double yearsOfExperience;       // Calculat din relații și date
    private Integer projects;               // Count din EntityTechnology pentru PROJECT
    private String description;             // Technology.description
    private String icon;                    // Icon.name din EntityMetadata
    private String color;                   // EntityMetadata.primaryColor
    private String backgroundColor;         // EntityMetadata.secondaryColor
    private List<String> features;          // TechnologyFeature.title list
    private String lastUsed;                // Ultimul proiect folosit (calculat)
    private Boolean trending;               // Technology.trending
    private Boolean certification;          // Technology.certification (din entitatea ta)
    private Boolean learning;               // Status din LearningProgress
}
