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
public class FeaturedProjectDto {
  private String id;
  private String title;
  private String description;
  private String shortDescription;
  private List<String> technologies;
  private String image;
  private String githubUrl;
  private String liveUrl;
  private Boolean featured;                   
  private String category;
  private String primaryColor;
  private String secondaryColor;
}
