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
public class TechCategoryInfoDto {

    private String id;                      // Category enum string
    private String name;                    // Display name
    private String description;             // Category description
    private String icon;                    // Icon name
    private String color;                   // Primary color
    private String bgColor;                 // Background color
}
