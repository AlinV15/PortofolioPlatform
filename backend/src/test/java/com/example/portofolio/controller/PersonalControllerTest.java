package com.example.portofolio.controller;

import com.example.portofolio.dto.HighlightDto;
import com.example.portofolio.dto.PersonalValueDto;
import com.example.portofolio.service.personal.PersonalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Personal Controller Tests - Completely Fixed")
class PersonalControllerTest {

    @Mock
    private PersonalService personalService;

    @InjectMocks
    private PersonalController personalController;

    private List<HighlightDto> sampleHighlights;
    private List<PersonalValueDto> sampleValues;

    @BeforeEach
    void setUp() {
        setupTestData();
    }

    private void setupTestData() {
        sampleHighlights = List.of(
                HighlightDto.builder()
                        .id("1")
                        .title("Top Performer")
                        .description("Achieved top performance rating")
                        .highlightType("achievement")
                        .priorityLevel("high")
                        .icon("Trophy")
                        .build()
        );

        sampleValues = List.of(
                PersonalValueDto.builder()
                        .id("1")
                        .title("Innovation")
                        .description("Always seeking creative solutions")
                        .icon("Lightbulb")
                        .importanceLevel("high")
                        .build()
        );
    }

    @Test
    @DisplayName("Should get personal highlights successfully")
    void shouldGetPersonalHighlightsSuccessfully() {
        // Given
        when(personalService.getPersonalHighlights(1L)).thenReturn(sampleHighlights);

        // When
        ResponseEntity<List<HighlightDto>> response = personalController.getPersonalHighlight();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getHeaders().getFirst("Highlights")).isEqualTo("value");
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getTitle()).isEqualTo("Top Performer");

        verify(personalService).getPersonalHighlights(1L);
    }

    @Test
    @DisplayName("Should get personal values successfully")
    void shouldGetPersonalValuesSuccessfully() {
        // Given
        when(personalService.getPersonalValues(1L)).thenReturn(sampleValues);

        // When
        ResponseEntity<List<PersonalValueDto>> response = personalController.getPersonalValue();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getHeaders().getFirst("Values")).isEqualTo("value");
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getTitle()).isEqualTo("Innovation");

        verify(personalService).getPersonalValues(1L);
    }

    @Test
    @DisplayName("Should return empty list when no highlights found")
    void shouldReturnEmptyListWhenNoHighlightsFound() {
        // Given
        when(personalService.getPersonalHighlights(1L)).thenReturn(List.of());

        // When
        ResponseEntity<List<HighlightDto>> response = personalController.getPersonalHighlight();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isEmpty();

        verify(personalService).getPersonalHighlights(1L);
    }

    @Test
    @DisplayName("Should return empty list when no values found")
    void shouldReturnEmptyListWhenNoValuesFound() {
        // Given
        when(personalService.getPersonalValues(1L)).thenReturn(List.of());

        // When
        ResponseEntity<List<PersonalValueDto>> response = personalController.getPersonalValue();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isEmpty();

        verify(personalService).getPersonalValues(1L);
    }

    @Test
    @DisplayName("Should handle service exceptions gracefully")
    void shouldHandleServiceExceptionsGracefully() {
        // Given
        when(personalService.getPersonalHighlights(1L))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThatThrownBy(() -> personalController.getPersonalHighlight())
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database error");

        verify(personalService).getPersonalHighlights(1L);
    }
}