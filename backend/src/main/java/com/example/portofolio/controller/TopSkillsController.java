package com.example.portofolio.controller;

import com.example.portofolio.dto.TopSkillDto;

import com.example.portofolio.service.core.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/")
public class TopSkillsController {
    @Autowired
    private SkillService skillService;

    @GetMapping("/skills/top")
    public ResponseEntity<List<TopSkillDto>> getTopSkills(
            ) {

        List<TopSkillDto> topSkills = skillService.getTopSkills(1L, 5);

        return ResponseEntity.ok()
                .header("Top-Skills", "value")
                .body(topSkills);
    }
}
