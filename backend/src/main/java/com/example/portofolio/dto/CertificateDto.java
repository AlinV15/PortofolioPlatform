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
public class CertificateDto {      // Renamed pentru consistență
    private String id;              // Long → String
    private String name;
    private String issuer;
    private String date;            // LocalDate → String (formatted)
    private String certificateId;
    private String description;
    private List<String> skillsGained;  // List<Skill> → List<String>
    private String categoryName;    // CertificationCategory type → String
    private String link;
    private String icon;            // Icon → String
    private String primaryColor;
    private String secondaryColor;
    private Boolean verified;
    private Boolean featured;
}

