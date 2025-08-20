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
public class CoreSkillDto {

    private String id;
    private String name;            
    private Integer level;
    private String proficiency;
    private String experience;
    private String color;
    private List<String> tags;
    private Integer projects;
}