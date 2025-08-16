package com.example.portofolio.controller;
import com.example.portofolio.dto.FeaturedSkillDto;
import com.example.portofolio.service.core.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;


@RestController
@RequestMapping("/")
public class FeaturedSkills {

    @Autowired
    private SkillService skillService;

    @GetMapping("/featured-skills")
    public ResponseEntity<List<FeaturedSkillDto>> getFeaturedProjects(){

        List<FeaturedSkillDto> body = skillService.findFeaturedSkills(1L);



        return ResponseEntity.ok().header("FeaturedSkills", "value").body(body);

    }
}
