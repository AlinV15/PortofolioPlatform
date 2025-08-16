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

    private String id;                          // Certificate.id.toString()
    private String title;                       // Certificate.name
    private String provider;                    // Certificate.provider
    private String category;                    // Mapped din CertificationCategory.name

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;                // Certificate.issueDate

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;               // Certificate.expiryDate

    private Boolean hasExpiry;                  // Certificate.hasExpiry
    private String credentialId;                // Certificate.credentialId
    private String verificationUrl;             // Certificate.certificateUrl (poate fi verification)
    private String certificateUrl;              // Certificate.certificateUrl
    private String description;                 // Certificate.description
    private List<String> skills;                // Din EntitySkill pentru CERTIFICATE
    private String primaryColor;                // EntityMetadata.primaryColor
    private String secondaryColor;              // EntityMetadata.secondaryColor
    private String icon;                        // Icon.name din EntityMetadata
    private Boolean verified;                   // Certificate.verified
    private Boolean featured;                   // EntityMetadata.featured
    private String score;                       // Certificate.score
    private Integer relevanceScore;             // Certificate.relevanceScore
}