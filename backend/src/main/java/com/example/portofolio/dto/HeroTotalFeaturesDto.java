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
public class HeroTotalFeaturesDto {
    private Integer nrOfProjects;
    private Integer nrOfTechologies;
    private Integer nrAcademicYears;
    private Integer nrOfCertifications;
}


