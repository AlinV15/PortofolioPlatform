package com.example.portofolio.controller;
import com.example.portofolio.dto.TechCategoryInfoDto;
import com.example.portofolio.dto.TechnologyDto;

import com.example.portofolio.dto.TechnologyStatisticsDto;
import com.example.portofolio.service.core.TechnologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/")
public class CoreTechnologiesController {
    @Autowired
    private TechnologyService technologyService;

    @GetMapping("/core-technologies")
    public ResponseEntity<List<TechnologyDto>> getTechnologies(
    ) {

        List<TechnologyDto> body = technologyService.findAllTechnologies();

        return ResponseEntity.ok()
                .header("Technologies", "value")
                .body(body);
    }

    @GetMapping("/tech-categories")
    public ResponseEntity<List<TechCategoryInfoDto>> getCategories(
    ) {

        List<TechCategoryInfoDto> body = technologyService.getCategoriesWithCount();

        return ResponseEntity.ok()
                .header("TechnologiesCategories", "value")
                .body(body);
    }

    @GetMapping("/tech-stats")
    public ResponseEntity<TechnologyStatisticsDto> getTechStats(
    ) {

        TechnologyStatisticsDto body = technologyService.getTechnologyStatistics();

        return ResponseEntity.ok()
                .header("TechnologiesStats", "value")
                .body(body);
    }


}
