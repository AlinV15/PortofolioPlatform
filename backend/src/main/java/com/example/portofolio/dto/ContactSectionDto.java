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
public class ContactSectionDto {

    private String id;                          // Section identifier (hardcoded sau din config)
    private String title;                       // Section title (ex: "Get In Touch")
    private String description;                 // Section description
    private String icon;                        // Icon.name (LucideIcon name)
    private Boolean active;                     // Section active state
}