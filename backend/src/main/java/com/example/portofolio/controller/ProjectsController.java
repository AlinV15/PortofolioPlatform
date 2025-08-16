package com.example.portofolio.controller;
import com.example.portofolio.dto.ProjectExportDto;

import com.example.portofolio.service.core.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class ProjectsController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectExportDto>> getProjects(){

        List<ProjectExportDto> body = projectService.findByPersonalId(1L);



        return ResponseEntity.ok().header("Projects", "value").body(body);

    }
}
