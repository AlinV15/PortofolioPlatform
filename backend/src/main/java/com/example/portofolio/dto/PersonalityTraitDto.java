package com.example.portofolio.dto;
import com.example.portofolio.entity.Icon;
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
public class PersonalityTraitDto {
    private Long id;
    private String trait;
    private String description;
    private String icon;
    private List<String> examples;    // String[] → List<String>
}
