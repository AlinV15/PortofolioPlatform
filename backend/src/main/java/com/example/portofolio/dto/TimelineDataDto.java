package com.example.portofolio.dto;

@lombok.Data
@lombok.Builder
public class TimelineDataDto {
    private Integer year;
    private Long count;
    private String entityType;
}