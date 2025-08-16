package com.example.portofolio.controller;
import com.example.portofolio.dto.ProjectCategoryDistributionDto;

import com.example.portofolio.service.core.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class CategoriesDistributionInProjects {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/category-distribution")
    public ResponseEntity<List<ProjectCategoryDistributionDto>> getCategoryDestribution(){

        List<ProjectCategoryDistributionDto> body = projectService.getProjectCategoryDistribution(1L);


        return ResponseEntity.ok().header("CategoryDistribution", "value").body(body);

    }
}
