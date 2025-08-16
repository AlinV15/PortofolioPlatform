package com.example.portofolio.dto;

import com.example.portofolio.entity.Icon;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HomeContactMethodDto {
    private Long id;
    private String label;
    private String value;
    private Icon icon;
    private String href;
    private String description;
}
