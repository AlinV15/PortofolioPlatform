package com.example.portofolio.controller;
import com.example.portofolio.dto.HobbyDto;
import com.example.portofolio.dto.TimelineItemDto;

import com.example.portofolio.service.portofolio.TimelineService;
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
public class TimelineController {
    @Autowired
    private TimelineService timelineService;

    @GetMapping("/timeline-items")
    public ResponseEntity<List<TimelineItemDto>> getTimelineItems(
    ) {
        List<TimelineItemDto> body = timelineService.getTimelineItems(1L);

        return ResponseEntity.ok()
                .header("TimelineItems", "value")
                .body(body);
    }

    @GetMapping("/timeline-stats")
    public ResponseEntity<Map<String, String>> getTimelineStats(
    ) {
        // Define map
        Map<String,String> body = new HashMap<>();

        // Dynamic data
        String milestones = String.valueOf(timelineService.getTimelineItems(1L).size());
        String achievements = String.valueOf(timelineService.getAchievementTimeline(1L).size());

        //Static data
        String MILESTONES = "Major Milestones";
        String ACHIEVEMENTS = " Achievements";

        body.put(MILESTONES,milestones);
        body.put(ACHIEVEMENTS,achievements);

        return ResponseEntity.ok()
                .header("TimelineStats", "value")
                .body(body);
    }
}
