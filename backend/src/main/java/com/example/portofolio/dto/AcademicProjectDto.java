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
public class AcademicProjectDto {
    private String id;
    private String title;
    private String courseName;
    private String description;
    private List<String> technologies;
    private Double duration;
    private String type;
    private String githubLink;
    private String icon;           
    private String primaryColor;
    private String secondaryColor;
}
