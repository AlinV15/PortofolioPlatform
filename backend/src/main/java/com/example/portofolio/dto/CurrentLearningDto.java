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
public class CurrentLearningDto {

    private String id;                          // LearningProgress.id.toString()
    private String title;                       // LearningProgress.name
    private String status;                      // LearningProgress.status.toString().toLowerCase()
    private Integer progress;                   // LearningProgress.progressPercentage
    private String color;                       // EntityMetadata.primaryColor pentru skill
    private String icon;                        // Icon.name din EntityMetadata pentru skill
    private String description;                 // LearningProgress.description
    private String startDate;                   // LearningProgress.startDate formatted
    private String expectedCompletion;          // LearningProgress.estimatedCompletion
    private String gradient;                    // EntityMetadata.gradient pentru skill
}