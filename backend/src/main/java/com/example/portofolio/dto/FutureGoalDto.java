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
public class FutureGoalDto {

    private String id;                          // FutureGoal.id.toString()
    private String title;                       // FutureGoal.title
    private String description;                 // FutureGoal.description
    private String color;                       // EntityMetadata.primaryColor
    private String icon;                        // Icon.name din EntityMetadata
    private String targetDate;                  // FutureGoal.targetDate formatted
    private String priority;                    // FutureGoal.priority.toString().toLowerCase()
    private String gradient;                    // EntityMetadata.gradient
}