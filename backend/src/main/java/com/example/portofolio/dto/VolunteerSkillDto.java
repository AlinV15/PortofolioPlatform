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
    private String name;                    // Skill.name
    private String category;               // 'leadership', 'technical', 'communication', 'project-management'
    private Integer level;                 // Skill.level sau calculat din volunteer experience

    // Optional fields pentru context
    private String description;            // Skill.description
    private List<String> organizations;   // Organizațiile unde a fost folosit skill-ul
    private Integer yearsOfExperience;     // Calculat din volunteer experiences
    private Boolean isActive;             // Dacă este folosit în volunteer-ing activ
}