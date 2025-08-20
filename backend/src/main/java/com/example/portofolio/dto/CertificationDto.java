package com.example.portofolio.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CertificationDto {

    private String id;
    private String title;
    private String provider;
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    private Boolean hasExpiry;
    private String credentialId;
    private String verificationUrl;
    private String certificateUrl;
    private String description;
    private List<String> skills;
    private String primaryColor;
    private String secondaryColor;
    private String icon;
    private Boolean verified;
    private Boolean featured;
    private String score;
    private Integer relevanceScore;             
}