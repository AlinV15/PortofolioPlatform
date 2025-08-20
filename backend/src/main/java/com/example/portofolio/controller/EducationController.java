package com.example.portofolio.controller;
import com.example.portofolio.dto.AcademicProjectDto;
import com.example.portofolio.dto.AcademicStatsDto;
import com.example.portofolio.dto.EducationDto;

import com.example.portofolio.service.core.EducationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;



@RestController
@RequestMapping("/")
public class EducationController {
    @Autowired
    private EducationService educationService;

    @GetMapping("/education")
    public ResponseEntity<List<EducationDto>> getEducation(
    ) {

        List<EducationDto> body = educationService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("Education", "value")
                .body(body);
    }

    @GetMapping("/education/projects")
    public ResponseEntity<List<AcademicProjectDto>> getAcademicProjects(
    ) {

        List<AcademicProjectDto> body = educationService.getAcademicProjects(1L);

        return ResponseEntity.ok()
                .header("AcademicProjects", "value")
                .body(body);
    }

    @GetMapping("/education/stats")
    public ResponseEntity<AcademicStatsDto> getAcademicStats(
    ) {
        AcademicStatsDto body = educationService.getAcademicStats(1L);


        return ResponseEntity.ok()
                .header("AcademicProjects", "value")
                .body(body);
    }


}
