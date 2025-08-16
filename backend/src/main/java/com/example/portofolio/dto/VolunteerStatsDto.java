package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VolunteerStatsDto {
    private Integer total_years;
    private Integer organizations;
    private Integer projects_coordinated;
    private Integer events_organized;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProjectStatDto {
        private String id;
        private String title;
        private String value;
        private String icon;
        private String color;
        private String bgColor;
        private String description;
    }
}
