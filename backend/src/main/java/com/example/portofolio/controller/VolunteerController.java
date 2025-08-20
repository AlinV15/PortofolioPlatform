package com.example.portofolio.controller;
import com.example.portofolio.dto.VolunteerExperienceDto;
import com.example.portofolio.dto.VolunteerSkillDto;
import com.example.portofolio.dto.VolunteerStatsDto;
import com.example.portofolio.service.volunteer.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/volunteer")

public class VolunteerController {
    @Autowired
    private VolunteerService volunteerService;

    @GetMapping("/experiences")
    public ResponseEntity<List<VolunteerExperienceDto>> getVolunteerExperiences(
    ) {

        List<VolunteerExperienceDto> body = volunteerService.getAllVolunteerExperiences(1L);

        return ResponseEntity.ok()
                .header("VolunteerExperiences", "value")
                .body(body);
    }

    @GetMapping("/stats")
    public ResponseEntity<VolunteerStatsDto> getVolunteerStats(
    ) {

        VolunteerStatsDto body = volunteerService.getVolunteerStatistics(1L);

        return ResponseEntity.ok()
                .header("VolunteerStats", "value")
                .body(body);
    }

    @GetMapping("/skills")
    public ResponseEntity<List<VolunteerSkillDto>> getVolunteerSkills(
    ) {

        List<VolunteerSkillDto> body = volunteerService.getVolunteerSkills(1L);

        return ResponseEntity.ok()
                .header("VolunteerSkills", "value")
                .body(body);
    }
}
