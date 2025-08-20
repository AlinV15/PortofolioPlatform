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
public class TechnologyDto {

    private String id;
    private String name;
    private String category;
    private String proficiency;
    private Integer level;
    private Double yearsOfExperience;
    private Integer projects;
    private String description;
    private String icon;
    private String color;
    private String backgroundColor;
    private List<String> features;
    private String lastUsed;
    private Boolean trending;
    private Boolean certification;
    private Boolean learning;
}
