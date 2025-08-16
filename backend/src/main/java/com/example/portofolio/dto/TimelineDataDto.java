package com.example.portofolio.dto;

/**
 * Timeline data DTO for education
 */
@lombok.Data
@lombok.Builder
public class TimelineDataDto {
    private Integer year;
    private Long count;
    private String entityType;
}