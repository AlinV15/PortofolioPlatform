package com.example.portofolio.controller;
import com.example.portofolio.dto.FeaturedProjectDto;
import com.example.portofolio.service.core.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;


@RestController
@RequestMapping("/")
public class FeaturedProjectsController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/featured-projects")
    public ResponseEntity<List<FeaturedProjectDto>> getFeaturedProjects(){

        List<FeaturedProjectDto> body = projectService.findFeaturedProjects(1L);


        return ResponseEntity.ok().header("FeaturedProjects", "value").body(body);

    }
}
