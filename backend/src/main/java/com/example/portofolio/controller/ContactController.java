package com.example.portofolio.controller;
import com.example.portofolio.dto.ContactInfoDto;
import com.example.portofolio.dto.ContactLocationDto;
import com.example.portofolio.dto.TimelineItemDto;
import com.example.portofolio.service.personal.ContactService;
import com.example.portofolio.service.portofolio.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/contact")
public class ContactController {
    @Autowired
    private ContactService contactService;

    @GetMapping("/info")
    public ResponseEntity<Optional<ContactInfoDto>> getInfo(
    ) {
        Optional<ContactInfoDto> body = contactService.findByPersonalId(1L);

        return ResponseEntity.ok()
                .header("ContactInfo", "value")
                .body(body);
    }

    @GetMapping("/location")
    public ResponseEntity<Optional<ContactLocationDto>> getLocation(
    ) {
        Optional<ContactLocationDto> body = contactService.findLocationByContactInfoId(1L);

        return ResponseEntity.ok()
                .header("ContactLocation", "value")
                .body(body);
    }
}
