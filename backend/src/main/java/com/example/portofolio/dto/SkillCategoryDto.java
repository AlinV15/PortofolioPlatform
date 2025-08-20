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
public class SkillCategoryDto {

    private String id;
    private String name;
    private Integer skillCount;
    private Double avgLevel;
    private String color;
    private String bgColor;
    private String icon;
    private Integer trending;
    private String description;
}