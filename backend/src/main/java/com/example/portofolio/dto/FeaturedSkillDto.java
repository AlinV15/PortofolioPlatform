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
public class FeaturedSkillDto {
    private String id;
    private String name;
    private Integer level;
    private String categoryName;
    private String icon;
    private String description;
    private Double yearsOfExperience;
    private String color;
    private List<String> projects;              
    private String proficiency;
    private Boolean trending;
    private Boolean learning;
}
