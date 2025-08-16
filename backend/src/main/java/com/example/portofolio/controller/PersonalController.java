package com.example.portofolio.controller;
import com.example.portofolio.dto.HighlightDto;
import com.example.portofolio.dto.LearningProgressDto;
import com.example.portofolio.dto.PersonalHighlightDto;
import com.example.portofolio.dto.PersonalValueDto;
import com.example.portofolio.entity.Personal;
import com.example.portofolio.service.personal.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/personal")
public class PersonalController {

    @Autowired
    private PersonalService personalService;

    @GetMapping("/highlights")
    public ResponseEntity<List<HighlightDto>> getPersonalHighlight(
    ) {

        List<HighlightDto> body = personalService.getPersonalHighlights(1L);

        return ResponseEntity.ok()
                .header("Highlights", "value")
                .body(body);
    }

    @GetMapping("/values")
    public ResponseEntity<List<PersonalValueDto>> getPersonalValue(
    ) {

        List<PersonalValueDto> body = personalService.getPersonalValues(1L);

        return ResponseEntity.ok()
                .header("Values", "value")
                .body(body);
    }

//    @GetMapping("/")
//    public ResponseEntity<List<Personal>> getPersonalInfo(
//    ) {
//
//        List<Personal> body = personalService.findAll();
//
//        return ResponseEntity.ok()
//                .header("PersonalInfo", "prs-info")
//                .body(body);
//    }
}
