package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectMetricsDto {
    private Long users;
    private String performance;
    private String codeQuality;
    private Long lines;
    private Integer commits;
    private BigDecimal testCoverage;
    private String lastUpdated;
}
