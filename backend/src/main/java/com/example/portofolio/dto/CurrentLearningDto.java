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
public class CurrentLearningDto {

    private String id;
    private String title;
    private String status;
    private Integer progress;
    private String color;
    private String icon;
    private String description;
    private String startDate;
    private String expectedCompletion;
    private String gradient;                    
}