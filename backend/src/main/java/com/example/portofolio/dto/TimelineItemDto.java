package com.example.portofolio.dto;
import com.example.portofolio.entity.Achievement;
import com.example.portofolio.entity.Icon;
import com.example.portofolio.entity.enums.AchievementType;
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
public class TimelineItemDto {              // Renamed
    private String id;                      // Long → String
    private String year;                    // Integer → String
    private String title;
    private String subtitle;
    private String description;
    private String type;                    // AchievementType → String
    private String icon;                    // Icon → String
    private String color;
    private String details;
    private Boolean current;                // boolean → Boolean
    private List<AchievementDto> achievements; // List<Achievement> → DTO
    private String link;
    private String primaryColor;
    private String secondaryColor;
}
