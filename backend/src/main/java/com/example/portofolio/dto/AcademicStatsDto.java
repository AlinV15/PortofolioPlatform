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
public class AcademicStatsDto {
    private Integer totalCourses;
    private String currentYear;
    private String specialization;
    private List<String> focusAreas;
    private List<AcademicLanguageDto> languages; 
}

