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
public class ProjectCategoryDistributionDto {
    private String category;
    private Long projectCount;
    private Double percentage;
    private String formattedPercentage;

    public String getFormattedPercentage() {
        if (percentage == null) return "0%";

        BigDecimal rounded = BigDecimal.valueOf(percentage)
                .setScale(0, RoundingMode.HALF_UP);
        return rounded.intValue() + "%";
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
        this.formattedPercentage = getFormattedPercentage();
    }
}