package com.example.portofolio.controller;

import com.example.portofolio.service.core.ProjectService;
import com.example.portofolio.service.core.TechnologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/")
public class ProjectStatsController {

    // dynamic values
    @Autowired
    private TechnologyService technologyService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/project-stats")
    public ResponseEntity<Map<String,Long>> getProjectStats(){

        Map<String,Long> body = new HashMap<>();

        Long totalProjects = projectService.count();
        Long technologies = technologyService.count();
        Long liveProjects = (long) projectService.findLiveProjects(1L).size();

        // static values + attributions in map
        String TOTAL_PROJECTS = "totalProjects";
        body.put(TOTAL_PROJECTS, totalProjects);
        String TECHNOLOGIES = "technologies";
        body.put(TECHNOLOGIES, technologies);
        String LIVE_PROJECTS = "liveProjects";
        body.put(LIVE_PROJECTS, liveProjects);

        return ResponseEntity.ok().header("ProjectStats", "value").body(body);

    }
}
