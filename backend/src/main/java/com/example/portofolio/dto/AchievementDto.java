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
public class AchievementDto {
    private String id;
    private String title;
    private String description;
    private String date;
    private String type;
    private String icon;
    private String primaryColor;
    private String secondaryColor;
    private String recognitionLevel;   
}
