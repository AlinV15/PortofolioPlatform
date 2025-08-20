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
public class TimelineItemDto {
    private String id;
    private String year;
    private String title;
    private String subtitle;
    private String description;
    private String type;
    private String icon;
    private String color;
    private String details;
    private Boolean current;
    private List<AchievementDto> achievements;
    private String link;
    private String primaryColor;
    private String secondaryColor;
}
