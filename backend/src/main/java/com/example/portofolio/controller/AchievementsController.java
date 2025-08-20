package com.example.portofolio.controller;
import com.example.portofolio.dto.AchievementDto;
import com.example.portofolio.service.core.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class AchievementsController {
    @Autowired
    private AchievementService achievementService;

    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDto>> getLearningProgress(
    ) {

        List<AchievementDto> body = achievementService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("Achievements", "value")
                .body(body);
    }
}
