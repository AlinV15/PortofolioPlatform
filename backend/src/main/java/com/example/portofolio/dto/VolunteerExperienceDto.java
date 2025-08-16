package com.example.portofolio.dto;

import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.ImpactLevel;
import com.example.portofolio.entity.enums.VolunteerStatus;
import com.example.portofolio.entity.enums.VolunteerType;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)

public class AboutVolunteerExp {
    private Long id;
    private String organization;
    private String role;
    private String period;
    private String location;
    private VolunteerType type;
    private VolunteerStatus status;
    private String description;
    private List<VolunteerResponsibility> responsibilities;
    private List<Achievement> achievements;
    private List<Skill> skills_gained;
    private List<Project> projects;
    private ImpactLevel impact;
    private Icon icon;
    private String website;
}
