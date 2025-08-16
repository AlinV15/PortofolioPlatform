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
public class ProjectDto {
    private String id;
    private String title;
    private String description;
    private String shortDescription;
    private List<String> technologies;     // String names în loc de Technology entities
    private String image;
    private String githubUrl;             // Consistent naming
    private String liveUrl;               // Consistent cu interfața frontend
    private Boolean featured;
    private String category;
    private String status;
    private String complexity;
    private Integer year;
    private String primaryColor;
    private String secondaryColor;
}
