package com.example.portofolio.controller;
import com.example.portofolio.service.core.CertificateService;
import com.example.portofolio.service.core.TechnologyService;
import com.example.portofolio.service.portofolio.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class KeyStatisticsController {

    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private TechnologyService technologyService;
    @Autowired
    private CertificateService certificateService;

    private static final String KEY_PROJECTS = "projects";
    private static final String KEY_EDUCATION_YEARS = "educationYears";
    private static final String KEY_TECHNOLOGIES = "technologies";
    private static final String KEY_CERTIFICATES = "certificates";

    @GetMapping("/key-statistics")
    public ResponseEntity<Map<String, Long>> getStatistics(){
        Map<String, Long> body = new HashMap<>();

       Long projects  = statisticsService.getProjectStatistics(1L).getTotalProjects();
       Long educationYears = statisticsService.getEducationStatistics(1L).getTotalEducation();
       Long technologies = technologyService.count();
       Long certificates = certificateService.count();

        body.put(KEY_PROJECTS, projects);
        body.put(KEY_EDUCATION_YEARS, educationYears);
        body.put(KEY_TECHNOLOGIES, technologies);
        body.put(KEY_CERTIFICATES, certificates);
        


        return ResponseEntity.ok().header("KeyStatistics", "valoare").body(body);

    }
}
