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
    private String id;                          // Long → String
    private String level;                       // EducationLevel → String
    private String institution;
    private String degree;
    private String field;
    private String period;
    private String location;
    private String description;
    private List<AchievementDto> achievements;  // List<Achievement> → List<AchievementDto>
    private List<CourseDto> relevantCourses;    // List<Course> → List<CourseDto>
    private String status;                      // EducationStatus → String
    private String gpa;
    private List<HighlightDto> highlights;      // List<Highlight> → List<HighlightDto>
    private String icon;                        // Icon → String
    private String primaryColor;
    private String secondaryColor;
}

