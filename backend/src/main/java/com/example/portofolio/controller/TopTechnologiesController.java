package com.example.portofolio.controller;
import com.example.portofolio.dto.ProjectExportDto;
import com.example.portofolio.dto.TechnologyDto;
import com.example.portofolio.service.core.TechnologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class TopTechnologiesController {
    @Autowired
    private TechnologyService technologyService;

    @GetMapping("/top-technologies")
    public ResponseEntity<List<String>> getTopTechnologies(){

        List<String> body = technologyService.findTrendingTechnologies()
                .stream()
                .map(TechnologyDto::getName)  // sau tech -> tech.getName()
                .toList();

        return ResponseEntity.ok().header("TopTechnologies", "value").body(body);

    }
}
