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
public class EducationDto {
    private String id;
    private String level;
    private String institution;
    private String degree;
    private String field;
    private String period;
    private String location;
    private String description;
    private List<AchievementDto> achievements;
    private List<CourseDto> relevantCourses;
    private String status;
    private String gpa;
    private List<HighlightDto> highlights;
    private String icon;                        
    private String primaryColor;
    private String secondaryColor;
}

