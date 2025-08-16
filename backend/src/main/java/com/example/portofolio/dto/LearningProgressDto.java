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
public class LearningProgressDto {

    private String id;              // LearningProgress.id.toString()
    private String name;            // LearningProgress.name
    private Integer progress;       // LearningProgress.progressPercentage
    private String color;           // EntityMetadata.primaryColor pentru skill
    private Integer timeSpent;      // LearningProgress.timeSpentHours.intValue()
    private String eta;             // LearningProgress.estimatedCompletion
    private String description;     // LearningProgress.description
}