package com.example.portofolio.controller;
import com.example.portofolio.dto.SkillDto;

import com.example.portofolio.dto.SkillStatisticsDto;
import com.example.portofolio.dto.SkillsHeroStatsDto;
import com.example.portofolio.service.core.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/")
public class CoreSkillController {
    @Autowired
    private SkillService skillService;

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getTopSkills(
    ) {

        List<SkillDto> body = skillService.findByPersonalId(1L);
        return ResponseEntity.ok()
                .header("Skills", "value")
                .body(body);
    }

    @GetMapping("/skills/stats")
    public ResponseEntity<SkillsHeroStatsDto> getSkillsStats(
    ) {

        SkillsHeroStatsDto heroStats = skillService.getHeroStats(1L);

        return ResponseEntity.ok()
                .header("X-Years-Coding", heroStats.getYearsCoding())
                .header("X-Projects", heroStats.getProjects())
                .header("X-Certifications", heroStats.getCertifications())
                .header("X-Avg-Proficiency", heroStats.getAvgProficiency())
                .body(heroStats);
    }

}
