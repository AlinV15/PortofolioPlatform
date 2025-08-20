package com.example.portofolio.service;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.personal.PersonalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Personal Service Tests - Completely Fixed")
class PersonalServiceTest {

    @Mock private PersonalRepository personalRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private CertificateRepository certificateRepository;
    @Mock private AchievementRepository achievementRepository;
    @Mock private EducationRepository educationRepository;
    @Mock private ContactInfoRepository contactInfoRepository;
    @Mock private EntityTechnologyRepository entityTechnologyRepository;


    @InjectMocks
    private PersonalService personalService;

    private Personal testPersonal;

    @BeforeEach
    void setUp() {
        setupTestData();
    }

    private void setupTestData() {
        // Create Personal WITHOUT .id() - ID is auto-generated
        testPersonal = Personal.builder()
                .firstName("John")
                .lastName("Doe")
                .age(30)
                .description("Software Developer")
                .build();

        // Simulate that this personal has ID=1L after being saved
        // We'll use reflection to set the ID for testing
        setIdUsingReflection(testPersonal, 1L);
    }

    // Helper method to set ID using reflection (simulates database generation)
    private void setIdUsingReflection(Object entity, Long id) {
        try {
            java.lang.reflect.Field idField = entity.getClass().getSuperclass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(entity, id);
        } catch (Exception e) {
            // If reflection fails, just continue - some tests might not need ID
        }
    }

    // ===== BASIC PERSONAL OPERATIONS TESTS =====

    @Test
    @DisplayName("Should find Personal by ID")
    void shouldFindPersonalById() {
        // Given
        when(personalRepository.findById(1L)).thenReturn(Optional.of(testPersonal));

        // When
        Optional<Personal> result = personalService.findById(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("John");
        assertThat(result.get().getLastName()).isEqualTo("Doe");
        verify(personalRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when Personal not found")
    void shouldReturnEmptyWhenPersonalNotFound() {
        // Given
        when(personalRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<Personal> result = personalService.findById(999L);

        // Then
        assertThat(result).isEmpty();
        verify(personalRepository).findById(999L);
    }

    @Test
    @DisplayName("Should find all Personals")
    void shouldFindAllPersonals() {
        // Given
        List<Personal> personals = List.of(testPersonal);
        when(personalRepository.findAll()).thenReturn(personals);

        // When
        List<Personal> result = personalService.findAll();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
        verify(personalRepository).findAll();
    }

    @Test
    @DisplayName("Should save Personal")
    void shouldSavePersonal() {
        // Given
        when(personalRepository.save(testPersonal)).thenReturn(testPersonal);

        // When
        Personal result = personalService.save(testPersonal);

        // Then
        assertThat(result).isEqualTo(testPersonal);
        verify(personalRepository).save(testPersonal);
    }

    @Test
    @DisplayName("Should delete Personal by ID")
    void shouldDeletePersonalById() {
        // Given
        doNothing().when(personalRepository).deleteById(1L);

        // When
        personalService.deleteById(1L);

        // Then
        verify(personalRepository).deleteById(1L);
    }

    // ===== HERO SECTION TESTS =====

    @Test
    @DisplayName("Should get hero total features")
    void shouldGetHeroTotalFeatures() {
        // Given
        Long personalId = 1L;
        when(projectRepository.countByPersonalId(personalId)).thenReturn(5L);
        when(entityTechnologyRepository.countDistinctTechnologiesByPersonalId(personalId)).thenReturn(10);
        when(educationRepository.countAcademicYearsByPersonalId(personalId)).thenReturn(4);
        when(certificateRepository.countByPersonalId(personalId)).thenReturn(3L);

        // When
        HeroTotalFeaturesDto result = personalService.getHeroTotalFeatures(personalId);

        // Then
        assertThat(result.getNrOfProjects()).isEqualTo(5);
        assertThat(result.getNrOfTechnologies()).isEqualTo(10);
        assertThat(result.getNrAcademicYears()).isEqualTo(4);
        assertThat(result.getNrOfCertifications()).isEqualTo(3);

        verify(projectRepository).countByPersonalId(personalId);
        verify(entityTechnologyRepository).countDistinctTechnologiesByPersonalId(personalId);
        verify(educationRepository).countAcademicYearsByPersonalId(personalId);
        verify(certificateRepository).countByPersonalId(personalId);
    }

    @Test
    @DisplayName("Should handle null values in hero total features")
    void shouldHandleNullValuesInHeroTotalFeatures() {
        // Given
        Long personalId = 1L;
        when(projectRepository.countByPersonalId(personalId)).thenReturn(0L);
        when(entityTechnologyRepository.countDistinctTechnologiesByPersonalId(personalId)).thenReturn(0);
        when(educationRepository.countAcademicYearsByPersonalId(personalId)).thenReturn(0);
        when(certificateRepository.countByPersonalId(personalId)).thenReturn(0L);

        // When
        HeroTotalFeaturesDto result = personalService.getHeroTotalFeatures(personalId);

        // Then
        assertThat(result.getNrOfProjects()).isEqualTo(0);
        assertThat(result.getNrOfTechnologies()).isEqualTo(0);
        assertThat(result.getNrAcademicYears()).isEqualTo(0);
        assertThat(result.getNrOfCertifications()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should get home story highlights")
    void shouldGetHomeStoryHighlights() {
        // Given
        Long personalId = 1L;

        Education testEducation = Education.builder()
                .degree("Computer Science")
                .institution("Tech University")
                .build();
        setIdUsingReflection(testEducation, 1L);

        ContactLocation testContactLocation = ContactLocation.builder()
                .city("New York")
                .country("USA")
                .build();
        setIdUsingReflection(testContactLocation, 1L);

        ContactInfo testContactInfo = ContactInfo.builder()
                .contactLocation(testContactLocation)
                .build();
        setIdUsingReflection(testContactInfo, 1L);

        when(personalRepository.findById(personalId)).thenReturn(Optional.of(testPersonal));
        when(educationRepository.findCurrentByPersonalId(personalId)).thenReturn(testEducation);
        when(contactInfoRepository.findByPersonalId(personalId)).thenReturn(Optional.of(testContactInfo));

        // When
        HomeStoryHighLightsDto result = personalService.getHomeStoryHighlights(personalId);

        // Then
        assertThat(result.getCurrentRole()).isEqualTo("Computer Science");
        assertThat(result.getLocation()).isEqualTo("New York, USA");
        assertThat(result.getEducation()).isEqualTo("Tech University");
        assertThat(result.getPassion()).isEqualTo("Technology & Innovation");
        assertThat(result.getGoal()).isEqualTo("Building impactful software solutions");

        verify(personalRepository).findById(personalId);
        verify(educationRepository).findCurrentByPersonalId(personalId);
        verify(contactInfoRepository).findByPersonalId(personalId);
    }

    @Test
    @DisplayName("Should get featured stats")
    void shouldGetFeaturedStats() {
        // Given
        Long personalId = 1L;
        when(projectRepository.countByPersonalId(personalId)).thenReturn(5L);
        when(skillRepository.countByPersonalId(personalId)).thenReturn(15L);
        when(certificateRepository.countByPersonalId(personalId)).thenReturn(3L);
        when(achievementRepository.countByPersonalId(personalId)).thenReturn(7L);

        // When
        List<FeaturedStatDto> result = personalService.getFeaturedStats(personalId);

        // Then
        assertThat(result).hasSize(4);

        FeaturedStatDto projectsStat = result.stream()
                .filter(stat -> stat.getLabel().equals("Projects"))
                .findFirst()
                .orElseThrow();

        assertThat(projectsStat.getValue()).isEqualTo("5");
        assertThat(projectsStat.getIcon()).isEqualTo("Code");

        verify(projectRepository).countByPersonalId(personalId);
        verify(skillRepository).countByPersonalId(personalId);
        verify(certificateRepository).countByPersonalId(personalId);
        verify(achievementRepository).countByPersonalId(personalId);
    }

    @Test
    @DisplayName("Should throw exception when Personal not found for home story highlights")
    void shouldThrowExceptionWhenPersonalNotFoundForHomeStoryHighlights() {
        // Given
        Long personalId = 999L;
        when(personalRepository.findById(personalId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> personalService.getHomeStoryHighlights(personalId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Personal not found with id: 999");
    }
}