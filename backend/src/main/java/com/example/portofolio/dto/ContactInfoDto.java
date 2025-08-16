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
public class ContactInfoDto {

    private String email;                       // ContactInfo.email
    private String phone;                       // ContactInfo.phone
    private String location;                    // ContactLocation.city + ", " + country
    private String github;                      // ContactInfo.github
    private String linkedin;                    // ContactInfo.linkedin
}