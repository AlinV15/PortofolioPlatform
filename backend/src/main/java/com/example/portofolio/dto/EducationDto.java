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
    private Long id;
    private String level;              // enum → string
    private String institution;
    private String degree;
    private String field;
    private String period;
    private String location;
    private String description;
    private List<AchievementDto> achievements;     // DTO în loc de entity
    private List<CourseDto> relevantCourses;       // DTO în loc de entity
    private String status;             // enum → string
    private String gpa;
    private List<HighlightDto> highlights;         // DTO în loc de entity
    private String icon;
}

