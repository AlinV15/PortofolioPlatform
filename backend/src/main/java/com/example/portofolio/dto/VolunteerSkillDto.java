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
public class VolunteerSkillDto {
    private String name;
    private String category;
    private Integer level;
    private String description;
    private List<String> organizations;
    private Integer yearsOfExperience;
    private Boolean isActive;
}