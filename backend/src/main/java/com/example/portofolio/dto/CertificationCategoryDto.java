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
public class CertificationCategoryDto {

    private String id;                          // CertificationCategory.id.toString()
    private String name;                        // CertificationCategory.name
    private String icon;                        // Icon.name
    private String activeClass;                 // CSS class pentru active state
    private String hoverClass;                  // CSS class pentru hover state
}