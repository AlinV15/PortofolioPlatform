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
public class CertificateDto {
    private String id;
    private String name;
    private String issuer;
    private String date;
    private String certificateId;
    private String description;
    private List<String> skillsGained;
    private String categoryName;
    private String link;
    private String icon;            
    private String primaryColor;
    private String secondaryColor;
    private Boolean verified;
    private Boolean featured;
}

