package com.example.portofolio.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillDto {

    private String id;
    private String name;
    private Integer level;
    private String proficiency;
    private String description;
    private Double yearsOfExperience;
    private Integer projects;
    private String icon;
    private String color;
    private String category;
}