package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO care respectă interfața Skill din frontend:
 * {
 *   name: string;
 *   category: 'leadership' | 'technical' | 'communication' | 'project-management';
 *   level: number;
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VolunteerSkillDto {
    private String name;        // Skill.name
    private String category;    // Mapează la categoriile specifice volunteer
    private Integer level;      // Skill.level
}