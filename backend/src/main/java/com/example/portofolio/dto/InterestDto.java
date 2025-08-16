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
public class InterestDto {                      // Renamed
    private String id;                          // Long → String
    private String name;
    private String description;
    private String icon;                        // Icon → String
    private String category;                    // InterestCategory → String
    private String whyInterested;               // why_interested → whyInterested
    private List<RecentDiscoveryDto> recentDiscoveries; // List<RecentDiscovery> → DTO
    private String primaryColor;
    private String secondaryColor;
}
