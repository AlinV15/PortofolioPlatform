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
public class LearningMilestoneDto {

    private String id;                      // Achievement.id.toString() sau Project.id.toString()
    private String title;                   // Achievement.title sau Project.title
    private String year;                    // Anul din Achievement.achievementDate sau Project.year
    private String description;             // Achievement.description sau Project.description
    private List<String> technologies;      // Technology names folosite în milestone
}
