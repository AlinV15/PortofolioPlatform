package com.example.portofolio.dto;

import com.example.portofolio.entity.Icon;
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
public class FeaturedSkillCategoryDto {
    private String name;
    private List<FeaturedSkillDto> skills;
    private Icon icon;
    private String description;
}
