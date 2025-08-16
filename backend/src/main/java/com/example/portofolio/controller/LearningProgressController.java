package com.example.portofolio.controller;
import com.example.portofolio.dto.*;

import com.example.portofolio.service.core.LearningProgressService;

import com.example.portofolio.service.personal.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class LearningProgressController {
    @Autowired
    private LearningProgressService learningProgressService;

    @Autowired
    private PersonalService personalService;

    @GetMapping("/learning-progress")
    public ResponseEntity<List<LearningProgressDto>> getLearningProgress(
    ) {

        List<LearningProgressDto> body = learningProgressService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("LearningProgress", "value")
                .body(body);
    }
    @GetMapping("/learning-milestones")
    public ResponseEntity<List<LearningMilestoneDto>> getLearningMilestone(
    ) {

        List<LearningMilestoneDto> body = learningProgressService.getLearningMilestones(1L);

        return ResponseEntity.ok()
                .header("LearningMilestones", "value")
                .body(body);
    }

    @GetMapping("/timeline-milestones")
    public ResponseEntity<List<TimelineMilestoneDto>> getTimelineMilestones(
    ) {

        List<TimelineMilestoneDto> body = personalService.getTimelineMilestones(1L);

        return ResponseEntity.ok()
                .header("TimelineMilestones", "value")
                .body(body);
    }

    @GetMapping("/current-learning")
    public ResponseEntity<List<CurrentLearningDto>> getCurrentLearning(
    ) {

        List<CurrentLearningDto> body = personalService.getCurrentLearning(1L);

        return ResponseEntity.ok()
                .header("CurrentLearning", "value")
                .body(body);
    }

    @GetMapping("/future-goals")
    public ResponseEntity<List<FutureGoalDto>> getFutureGoals(
    ) {

        List<FutureGoalDto> body = personalService.getFutureGoals(1L);

        return ResponseEntity.ok()
                .header("FutureGoals", "value")
                .body(body);
    }
}
