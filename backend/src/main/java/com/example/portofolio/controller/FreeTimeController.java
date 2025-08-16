package com.example.portofolio.controller;
import com.example.portofolio.dto.HobbyDto;
import com.example.portofolio.dto.InterestDto;
import com.example.portofolio.dto.PersonalityTraitDto;

import com.example.portofolio.service.personal.HobbyService;
import com.example.portofolio.service.personal.InterestService;
import com.example.portofolio.service.personal.PersonalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/")
public class FreeTimeController {
    @Autowired
    private HobbyService hobbyService;
    @Autowired
    private InterestService interestService;

    @Autowired
    private PersonalService personalService;

    @GetMapping("/hobbies")
    public ResponseEntity<List<HobbyDto>> getHobbies(
    ) {

        List<HobbyDto> body = hobbyService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("Hobbies", "value")
                .body(body);
    }

    @GetMapping("/interests")
    public ResponseEntity<List<InterestDto>> getInterests(
    ) {

        List<InterestDto> body = interestService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("Interests", "value")
                .body(body);
    }

    @GetMapping("/personality-trait")
    public ResponseEntity<List<PersonalityTraitDto>> getPersonalityTraits(
    ) {

        List<PersonalityTraitDto> body = personalService.getPersonalityTraits(1L);

        return ResponseEntity.ok()
                .header("PersonalityTraits", "value")
                .body(body);
    }
}
