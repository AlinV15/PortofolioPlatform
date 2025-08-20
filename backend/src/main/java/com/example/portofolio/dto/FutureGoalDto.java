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
public class FutureGoalDto {

    private String id;
    private String title;
    private String description;
    private String color;
    private String icon;
    private String targetDate;
    private String priority;
    private String gradient;                    
}