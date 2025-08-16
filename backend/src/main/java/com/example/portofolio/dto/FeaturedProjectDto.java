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
public class FeaturedProjectDto {               // Renamed
  private String id;                          // Long → String
  private String title;
  private String description;
  private String shortDescription;
  private List<String> technologies;          // List<Technology> → List<String>
  private String image;
  private String githubUrl;                   // Add missing githubUrl
  private String liveUrl;
  private Boolean featured;                   // boolean → Boolean
  private String category;
  private String primaryColor;
  private String secondaryColor;
}
