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
public class AcademicLanguageDto {
    private String name;                    // Skill.name
    private String level;                   // Din Skill.description sau Skill.proficiency
    private String icon;                    // Emoji sau icon name
    private String iconType;                // "emoji" sau "icon"
}