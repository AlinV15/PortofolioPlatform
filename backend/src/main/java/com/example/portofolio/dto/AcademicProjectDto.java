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
public class AcademicProjectDto {  // Renamed
    private String id;              // Long → String
    private String title;
    private String courseName;      // Course course → String courseName
    private String description;
    private List<String> technologies;  // List<Technology> → List<String>
    private Double duration;
    private String type;
    private String githubLink;      // github_link → githubLink (camelCase)
    private String icon;            // Icon icon → String icon
    private String primaryColor;
    private String secondaryColor;
}
