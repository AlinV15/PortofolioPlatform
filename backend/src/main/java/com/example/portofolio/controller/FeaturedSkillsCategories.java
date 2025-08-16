package com.example.portofolio.controller;
import com.example.portofolio.dto.FeaturedSkillCategoryDto;

import com.example.portofolio.service.core.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class FeaturedSkillsCategories {

    @Autowired
    private SkillService skillService;

    @GetMapping("/featured-skills/categories")
    public ResponseEntity<List<FeaturedSkillCategoryDto>> getFeaturedProjects(){

        List<FeaturedSkillCategoryDto> body = skillService.getAllSkillCategories();


        return ResponseEntity.ok().header("FeaturedSkills", "value").body(body);

    }
}
