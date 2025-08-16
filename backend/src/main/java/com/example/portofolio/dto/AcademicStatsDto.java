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
    private Integer totalCourses;           // Numărul total de cursuri
    private String currentYear;             // Anul curent de studiu (din metoda ta)
    private String specialization;          // Education.fieldOfStudy sau Education.degree
    private List<String> focusAreas;        // Top 4 categorii de proiecte
    private List<AcademicLanguageDto> languages; // Limbile străine din skills
}

