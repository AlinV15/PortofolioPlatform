package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DevelopmentExperienceDto {

    // Years Active - bazat pe primul și ultimul proiect
    private Integer yearsActive;
    private Integer firstProjectYear;
    private Integer latestProjectYear;

    // Average Complexity - cea mai frecventă complexitate
    private String avgComplexity;  // "Beginner", "Intermediate", "Advanced", "Expert"
    private String avgComplexityLabel; // Pentru display mai frumos

    // Success Rate - rata de deploy/finalizare
    private Double successRate;
    private String formattedSuccessRate; // "85%"
    private Long deployedProjects;
    private Long totalProjects;

    // Additional insights
    private Long liveProjects; // proiecte cu demoUrl
    private String experienceLevel; // "Junior", "Mid", "Senior"

    // Helper methods
    public String getFormattedSuccessRate() {
        if (successRate == null) return "0%";

        BigDecimal rounded = BigDecimal.valueOf(successRate)
                .setScale(0, RoundingMode.HALF_UP);
        return rounded.intValue() + "%";
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
        this.formattedSuccessRate = getFormattedSuccessRate();
    }

    public String getAvgComplexityLabel() {
        if (avgComplexity == null) return "Unknown";

        return switch (avgComplexity.toUpperCase()) {
            case "BEGINNER" -> "Beginner";
            case "INTERMEDIATE" -> "Intermediate";
            case "ADVANCED" -> "Advanced";
            case "EXPERT" -> "Expert";
            default -> avgComplexity;
        };
    }

    public void setAvgComplexity(String avgComplexity) {
        this.avgComplexity = avgComplexity;
        this.avgComplexityLabel = getAvgComplexityLabel();
    }

    // Calculează nivelul de experiență bazat pe ani și complexitate
    public String getExperienceLevel() {
        if (yearsActive == null) return "Unknown";

        if (yearsActive <= 1) return "Junior";
        if (yearsActive <= 3) return "Mid-Level";
        if (yearsActive <= 5) return "Senior";
        return "Expert";
    }
}