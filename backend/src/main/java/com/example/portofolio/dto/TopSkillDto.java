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
public class TopSkillDto {
    private String name;
    private Integer level;  // sau Double dacă level-ul poate avea zecimale
    private String color;

    // Optional fields pentru mai multe detalii (nu afectează interfața)
    private String category;
    private String proficiency;
    private Integer projects;  // numărul de proiecte care folosesc skill-ul
}

