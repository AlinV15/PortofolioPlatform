package com.example.portofolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContactLocationDto {

    private String name;                        // ContactLocation.name
    private String address;                     // ContactLocation.address
    private String city;                        // ContactLocation.city
    private String country;                     // ContactLocation.country
    private CoordinatesDto coordinates;         // Nested DTO pentru lat/lng
    private String timezone;                    // ContactLocation.timezone
    private String workingHours;                // ContactLocation.workingHours

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CoordinatesDto {
        private Double lat;                     // ContactLocation.latitude.doubleValue()
        private Double lng;                     // ContactLocation.longitude.doubleValue()
    }
}