package com.example.portofolio.service.core;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.*;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.BaseService;
import com.example.portofolio.service.base.ServiceUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Optimized Education Service with ServiceUtils
 */
@Service
@Slf4j
public class EducationService extends BaseService<Education, Long, EducationRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final AchievementRepository achievementRepository;
    private final CourseRepository courseRepository;
    private final CourseProjectRepository courseProjectRepository;
    private final EntityTechnologyRepository entityTechnologyRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    @Autowired
    public EducationService(EducationRepository educationRepository,
                            EntityMetadataRepository entityMetadataRepository,
                            AchievementRepository achievementRepository,
                            CourseRepository courseRepository,
                            CourseProjectRepository courseProjectRepository,
                            EntityTechnologyRepository entityTechnologyRepository,
                            SkillRepository skillRepository,
                            ProjectRepository projectRepository) {
        super(educationRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.achievementRepository = achievementRepository;
        this.courseRepository = courseRepository;
        this.courseProjectRepository = courseProjectRepository;
        this.entityTechnologyRepository = entityTechnologyRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.EDUCATION.name();
    }

    @Override
    protected EducationDto toDto(Education education) {
        return toEducationDto(education);
    }

    // ===== CORE EDUCATION QUERIES =====

    @Cacheable(value = "educationByPersonal", key = "#personalId")
    public List<EducationDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalIdWithCoursesAndAchievements(personalId);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    public List<EducationDto> findByPersonalIdAndLevel(@Valid @NotNull @Positive Long personalId,
                                                       @Valid @NotNull EducationLevel level) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndLevel", personalId, level);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalIdAndLevel(personalId, level);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndLevel", result.size());
        return result;
    }

    public List<EducationDto> findByPersonalIdAndStatus(@Valid @NotNull @Positive Long personalId,
                                                        @Valid @NotNull EducationStatus status) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndStatus", personalId, status);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalIdAndStatus(personalId, status);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndStatus", result.size());
        return result;
    }

    @Cacheable(value = "featuredEducation", key = "#personalId")
    public List<EducationDto> findFeaturedEducation(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFeaturedEducation", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findFeaturedByPersonalId(personalId);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findFeaturedEducation", result.size());
        return result;
    }

    public List<EducationDto> findOngoingEducation(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findOngoingEducation", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findOngoingByPersonalId(personalId);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findOngoingEducation", result.size());
        return result;
    }

    public List<EducationDto> findCompletedEducation(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findCompletedEducation", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findCompletedByPersonalId(personalId);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findCompletedEducation", result.size());
        return result;
    }

    // ===== SEARCH & FILTERING =====

    public List<EducationDto> searchEducation(@Valid @NotNull @Positive Long personalId,
                                              @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchEducation", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Education> educations = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("searchEducation", result.size());
        return result;
    }

    public List<EducationDto> findByInstitution(@Valid @NotNull @Positive Long personalId,
                                                @Valid @NotNull String institution) {
        ServiceUtils.logMethodEntry("findByInstitution", personalId, institution);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalIdAndInstitution(personalId, institution);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findByInstitution", result.size());
        return result;
    }

    public List<EducationDto> findByFieldOfStudy(@Valid @NotNull @Positive Long personalId,
                                                 @Valid @NotNull String fieldOfStudy) {
        ServiceUtils.logMethodEntry("findByFieldOfStudy", personalId, fieldOfStudy);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalIdAndFieldOfStudy(personalId, fieldOfStudy);
        List<EducationDto> result = educations.stream()
                .map(this::toEducationDto)
                .toList();

        ServiceUtils.logMethodExit("findByFieldOfStudy", result.size());
        return result;
    }

    // ===== STATISTICS =====

    @Cacheable(value = "educationStatsByInstitution", key = "#personalId")
    public Map<String, Long> getEducationStatsByInstitution(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getEducationStatsByInstitution", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.countEducationByInstitution(personalId);
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getEducationStatsByInstitution", stats.size());
        return stats;
    }

    @Cacheable(value = "educationStatsByField", key = "#personalId")
    public Map<String, Long> getEducationStatsByField(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getEducationStatsByField", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.countEducationByField(personalId);
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getEducationStatsByField", stats.size());
        return stats;
    }

    public Map<EducationLevel, Long> getEducationStatsByLevel(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getEducationStatsByLevel", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.countEducationByLevel(personalId);
        Map<EducationLevel, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (EducationLevel) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getEducationStatsByLevel", stats.size());
        return stats;
    }

    @Cacheable(value = "educationStats", key = "#personalId")
    public EducationStatisticsDto getEducationStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getEducationStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalEducation = repository.countByPersonalId(personalId);
        Long ongoingCount = repository.countByPersonalIdAndStatus(personalId, EducationStatus.ONGOING);
        Long completedCount = repository.countByPersonalIdAndStatus(personalId, EducationStatus.COMPLETED);

        Map<String, Long> institutionStats = getEducationStatsByInstitution(personalId);
        Map<String, Long> fieldStats = getEducationStatsByField(personalId);
        Map<EducationLevel, Long> levelStats = getEducationStatsByLevel(personalId);

        EducationStatisticsDto result = EducationStatisticsDto.builder()
                .totalEducation(totalEducation)
                .ongoingCount(ongoingCount)
                .completedCount(completedCount)
                .institutionDistribution(institutionStats)
                .fieldDistribution(fieldStats)
                .levelDistribution(levelStats)
                .featuredCount((long) findFeaturedEducation(personalId).size())
                .build();

        ServiceUtils.logMethodExit("getEducationStatistics", result);
        return result;
    }

    @Cacheable(value = "educationTimeline", key = "#personalId")
    public List<TimelineDataDto> getEducationTimeline(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getEducationTimeline", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.getEducationTimelineByPersonalId(personalId);
        List<TimelineDataDto> timeline = results.stream()
                .map(row -> TimelineDataDto.builder()
                        .year(((Number) row[0]).intValue())
                        .count(((Number) row[1]).longValue())
                        .entityType("EDUCATION")
                        .build())
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .toList();

        ServiceUtils.logMethodExit("getEducationTimeline", timeline.size());
        return timeline;
    }

    // ===== COURSE MANAGEMENT =====

    public List<CourseDto> findRelevantCourses(@Valid @NotNull @Positive Long educationId) {
        ServiceUtils.logMethodEntry("findRelevantCourses", educationId);
        ServiceUtils.validateEntityId(educationId);

        List<Course> courses = courseRepository.findByEducationIdAndRelevantTrue(educationId);
        List<CourseDto> result = courses.stream()
                .map(this::toCourseDto)
                .toList();

        ServiceUtils.logMethodExit("findRelevantCourses", result.size());
        return result;
    }

    public List<CourseDto> findAllCourses(@Valid @NotNull @Positive Long educationId) {
        ServiceUtils.logMethodEntry("findAllCourses", educationId);
        ServiceUtils.validateEntityId(educationId);

        List<Course> courses = courseRepository.findByEducationIdOrderByYearDescSemesterDesc(educationId);
        List<CourseDto> result = courses.stream()
                .map(this::toCourseDto)
                .toList();

        ServiceUtils.logMethodExit("findAllCourses", result.size());
        return result;
    }

    public List<CourseDto> findCoursesByYear(@Valid @NotNull @Positive Long educationId,
                                             @Valid @NotNull Integer year) {
        ServiceUtils.logMethodEntry("findCoursesByYear", educationId, year);
        ServiceUtils.validateEntityId(educationId);

        List<Course> courses = courseRepository.findByEducationIdAndYear(educationId, year);
        List<CourseDto> result = courses.stream()
                .map(this::toCourseDto)
                .toList();

        ServiceUtils.logMethodExit("findCoursesByYear", result.size());
        return result;
    }

    // ===== ACHIEVEMENTS =====

    public List<AchievementDto> findEducationAchievements(@Valid @NotNull @Positive Long personalId,
                                                          @Valid @NotNull @Positive Long educationId) {
        ServiceUtils.logMethodEntry("findEducationAchievements", personalId, educationId);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateEntityId(educationId);

        List<Achievement> achievements = achievementRepository
                .findByPersonalIdAndEntityTypeAndEntityId(personalId, EntityType.EDUCATION, educationId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findEducationAchievements", result.size());
        return result;
    }

    // ===== DTO CONVERSION WITH SERVICEUTILS =====

    private EducationDto toEducationDto(Education education) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.EDUCATION, education.getId());

        List<AchievementDto> achievements = findEducationAchievements(
                education.getPersonal().getId(), education.getId());

        List<CourseDto> relevantCourses = findRelevantCourses(education.getId());

        String period = ServiceUtils.formatPeriod(education.getStartDate(), education.getEndDate());
        String duration = ServiceUtils.calculateDuration(education.getStartDate(), education.getEndDate());

        return EducationDto.builder()
                .id(education.getId().toString())
                .level(ServiceUtils.enumToLowerString(education.getLevel()))
                .institution(education.getInstitution())
                .degree(education.getDegree())
                .field(education.getFieldOfStudy())
                .period(period)
                .location(education.getLocation())
                .description(education.getDescription())
                .achievements(achievements)
                .relevantCourses(relevantCourses)
                .status(ServiceUtils.enumToLowerString(education.getStatus()))
                .gpa(education.getGpa())
                .highlights(getEducationHighlights(education))
                .icon(ServiceUtils.getIconFromMetadata(metadata, "graduation-cap"))
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, "#10B981"))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, "#A7F3D0"))
                .build();
    }

    private CourseDto toCourseDto(Course course) {
        return CourseDto.builder()
                .id(course.getId().toString())
                .title(course.getTitle())
                .description(ServiceUtils.truncateText(course.getDescription(), 200))
                .grade(course.getGrade())
                .credits(course.getCredits())
                .semester(course.getSemester())
                .year(course.getYear())
                .relevant(course.getRelevant())
                .build();
    }

    private AchievementDto toAchievementDto(Achievement achievement) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, achievement.getId());

        String formattedDate = ServiceUtils.formatDateAsIso(achievement.getAchievementDate());

        return AchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(ServiceUtils.truncateText(achievement.getDescription(), 300))
                .date(formattedDate)
                .type(ServiceUtils.enumToLowerString(achievement.getAchievementType()))
                .icon(ServiceUtils.getIconFromMetadata(metadata, "award"))
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, "#F59E0B"))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, "#FDE68A"))
                .recognitionLevel(ServiceUtils.enumToLowerString(achievement.getRecognitionLevel()))
                .build();
    }

// Adaugă în EducationService

    /**
     * Returnează toate proiectele academice pentru o persoană din toate etapele de educație
     */
    /**
     * Returnează toate proiectele academice pentru o persoană din toate etapele de educație
     */
    @Cacheable(value = "academicProjects", key = "#personalId")
    public List<AcademicProjectDto> getAcademicProjects(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAcademicProjects", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // Obține toate proiectele academice prin relația CourseProject DIRECT
        List<CourseProject> courseProjects = courseProjectRepository.findByPersonalIdWithDetails(personalId);

        List<AcademicProjectDto> result = courseProjects.stream()
                .map(this::toAcademicProjectDto)
                .collect(Collectors.toList());

        log.debug("Found {} academic projects for personalId: {}", result.size(), personalId);
        ServiceUtils.logMethodExit("getAcademicProjects", result.size());
        return result;
    }

    /**
     * Helper method pentru conversia la DTO
     */
    private AcademicProjectDto toAcademicProjectDto(CourseProject courseProject) {
        Project project = courseProject.getProject();
        Course course = courseProject.getCourse();

        // Obține tehnologiile pentru proiect
        List<String> technologies = entityTechnologyRepository
                .findByEntityTypeAndEntityIdWithTechnology(EntityType.PROJECT, project.getId())
                .stream()
                .map(et -> et.getTechnology().getName())
                .collect(Collectors.toList());

        // Obține metadata pentru culori și icon
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId());

        return AcademicProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .courseName(course.getTitle())
                .description(project.getDescription())
                .technologies(technologies)
                .duration(project.getDevelopmentTime())
                .type(project.getCategory() != null ? project.getCategory() : "Academic")
                .githubLink(project.getGithubUrl())
                .icon(getProjectIcon(project, metadata))
                .primaryColor(metadata.map(EntityMetadata::getPrimaryColor).orElse("#3B82F6"))
                .secondaryColor(metadata.map(EntityMetadata::getSecondaryColor).orElse("#93C5FD"))
                .build();
    }

    /**
     * Helper method pentru determinarea icon-ului proiectului
     */
    private String getProjectIcon(Project project, Optional<EntityMetadata> metadata) {
        // 1. Încearcă din metadata
        if (metadata.isPresent() && metadata.get().getIcon() != null) {
            return metadata.get().getIcon().getName();
        }

        // 2. Icon bazat pe categoria proiectului
        if (project.getCategory() != null) {
            return getIconByCategory(project.getCategory());
        }

        // 3. Icon bazat pe titlul proiectului
        return getIconByTitle(project.getTitle());
    }

    /**
     * Helper method pentru icon bazat pe categorie
     */
    private String getIconByCategory(String category) {
        if (category == null) return "folder";

        return switch (category.toLowerCase()) {
            case "web", "frontend" -> "globe";
            case "mobile", "app" -> "smartphone";
            case "desktop" -> "monitor";
            case "game", "gaming" -> "gamepad-2";
            case "ai", "machine learning" -> "brain";
            case "data", "database" -> "database";
            case "api", "backend" -> "server";
            case "security" -> "shield";
            default -> "folder";
        };
    }

    /**
     * Helper method pentru icon bazat pe titlu
     */
    private String getIconByTitle(String title) {
        if (title == null) return "folder";

        String lowerTitle = title.toLowerCase();
        if (lowerTitle.contains("web") || lowerTitle.contains("website")) return "globe";
        if (lowerTitle.contains("mobile") || lowerTitle.contains("app")) return "smartphone";
        if (lowerTitle.contains("game")) return "gamepad-2";
        if (lowerTitle.contains("ai") || lowerTitle.contains("machine")) return "brain";
        if (lowerTitle.contains("data") || lowerTitle.contains("analytics")) return "bar-chart";
        if (lowerTitle.contains("api")) return "server";
        if (lowerTitle.contains("security")) return "shield";
        if (lowerTitle.contains("chat") || lowerTitle.contains("message")) return "message-circle";
        if (lowerTitle.contains("shop") || lowerTitle.contains("store")) return "shopping-cart";

        return "folder"; // Default
    }

    // ===== HELPER METHODS =====

    private List<HighlightDto> getEducationHighlights(Education education) {
        // For now, return empty list - implement based on actual Highlight entity structure
        return List.of();
    }

    public List<Integer> getAvailableYears(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAvailableYears", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> educations = repository.findByPersonalId(personalId);
        List<Integer> years = educations.stream()
                .map(Education::getStartDate)
                .filter(Objects::nonNull)
                .map(LocalDate::getYear)
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .toList();

        ServiceUtils.logMethodExit("getAvailableYears", years.size());
        return years;
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Education> findFeatured() {
        return repository.findAll().stream()
                .filter(education -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.EDUCATION, education.getId());
                    return ServiceUtils.isFeatured(metadata);
                })
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.EDUCATION, id)
                .isPresent();
    }



    /**
     * Returnează anul curent de studiu pentru educația în desfășurare
     * Pentru educația finalizată returnează null
     */
    public String getCurrentYearOfStudy(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getCurrentYearOfStudy", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Education> ongoingEducations = repository.findByPersonalIdAndStatus(personalId, EducationStatus.ONGOING);
        Optional<Education> currentEducation = ongoingEducations.stream().findFirst();

        if (currentEducation.isEmpty()) {
            log.debug("No ongoing education found for personalId: {}", personalId);
            return null;
        }

        Education education = currentEducation.get();

        log.debug("Found ongoing education: id={}, startDate={}, endDate={}, status={}",
                education.getId(), education.getStartDate(), education.getEndDate(), education.getStatus());

        // PENTRU EDUCAȚIA ONGOING, IGNORĂM END_DATE
        // end_date pentru ONGOING este doar o estimare/planificare, nu înseamnă că e completă

        // Calculează anul curent de studiu
        LocalDate startDate = education.getStartDate();
        LocalDate currentDate = LocalDate.now();

        if (startDate == null) {
            log.warn("Start date is null for education id: {}", education.getId());
            return "1"; // Default la primul an
        }

        // Calculează diferența în ani (din septembrie 2022 până acum)
        int yearsDifference = currentDate.getYear() - startDate.getYear();

        // Ajustează pentru că anul academic începe în septembrie
        // Dacă suntem înainte de septembrie în anul curent, scădem un an
        if (currentDate.getMonthValue() < startDate.getMonthValue() ||
                (currentDate.getMonthValue() == startDate.getMonthValue() &&
                        currentDate.getDayOfMonth() < startDate.getDayOfMonth())) {
            yearsDifference--;
        }

        // Anul de studiu este diferența + 1 (primul an = 1, nu 0)
        int currentYear = yearsDifference + 1;

        // Validare pentru a evita valori negative sau prea mari
        if (currentYear < 1) {
            currentYear = 1;
        }

        // Pentru siguranță, limitează la maxim 6 ani (pentru studii universitare)
        if (currentYear > 6) {
            currentYear = 6;
        }

        String result = String.valueOf(currentYear);

        log.debug("Calculated current year: startDate={}, currentDate={}, yearsDifference={}, finalYear={}",
                startDate, currentDate, yearsDifference, result);

        ServiceUtils.logMethodExit("getCurrentYearOfStudy", result);
        return result;
    }

    @Cacheable(value = "academicStats", key = "#personalId")
    public AcademicStatsDto getAcademicStats(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAcademicStats", personalId);
        ServiceUtils.validatePersonalId(personalId);


        List<Education> ongoingEducations = repository.findByPersonalIdAndStatus(personalId, EducationStatus.ONGOING);
        Optional<Education> currentEducation = ongoingEducations.stream().findFirst();

        if (currentEducation.isEmpty()) {
            log.debug("No ongoing education found for personalId: {}", personalId);
            return AcademicStatsDto.builder()
                    .totalCourses(0)
                    .currentYear("0")
                    .specialization("No current education")
                    .focusAreas(List.of())
                    .languages(List.of())
                    .build();
        }

        Education education = currentEducation.get();

        // 2. Calculează totalul de cursuri
        Integer totalCourses = getTotalCoursesForEducation(education.getId());

        // 3. Anul curent din metoda existentă
        String currentYear = getCurrentYearOfStudy(personalId);

        // 4. Specializarea din fieldOfStudy sau degree
        String specialization = education.getFieldOfStudy() != null ?
                education.getFieldOfStudy() :
                education.getDegree();

        // 5. Focus Areas - top 4 categorii de proiecte
        List<String> focusAreas = getTopProjectCategories(personalId, 4);

        // 6. Limbile străine din skills
        List<AcademicLanguageDto> languages = getForeignLanguages(personalId);

        AcademicStatsDto result = AcademicStatsDto.builder()
                .totalCourses(totalCourses)
                .currentYear(currentYear != null ? currentYear : "0")
                .specialization(specialization)
                .focusAreas(focusAreas)
                .languages(languages)
                .build();

        log.debug("Academic stats for personalId {}: {} courses, year {}, specialization: {}",
                personalId, totalCourses, currentYear, specialization);

        ServiceUtils.logMethodExit("getAcademicStats", result);
        return result;
    }

    /**
     * Obține numărul total de cursuri pentru o educație
     */
    private Integer getTotalCoursesForEducation(Long educationId) {
        log.debug("Getting total courses for educationId: {}", educationId);

        Long count = courseRepository.countByEducationId(educationId);
        log.debug("Found {} courses for educationId: {}", count, educationId);

        return Math.toIntExact(count);
    }

    /**
     * Obține top N categorii de proiecte ca focus areas
     */
    private List<String> getTopProjectCategories(Long personalId, int limit) {
        List<Object[]> categoryDistribution = projectRepository.findProjectCategoryDistribution(personalId);

        return categoryDistribution.stream()
                .limit(limit)
                .map(row -> (String) row[0])
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Obține limbile străine din skills cu categoria "Foreign Languages"
     */
    private List<AcademicLanguageDto> getForeignLanguages(Long personalId) {
        // Caută skills cu categoria Foreign Languages
        List<Skill> languageSkills = skillRepository.findByPersonalIdAndCategoryName(personalId, "Foreign Languages");

        return languageSkills.stream()
                .map(this::mapSkillToLanguage)
                .collect(Collectors.toList());
    }

    /**
     * Mapează un skill de limbă la AcademicLanguageDto
     */
    private AcademicLanguageDto mapSkillToLanguage(Skill skill) {
        String skillName = skill.getName().toLowerCase();

        // Determină emoji-ul și nivelul
        String emoji = getLanguageEmoji(skillName);
        String level = extractLanguageLevel(skill);

        return AcademicLanguageDto.builder()
                .name(skill.getName())
                .level(level)
                .icon(emoji)
                .iconType("emoji")
                .build();
    }

    /**
     * Obține emoji-ul pentru o limbă
     */
    private String getLanguageEmoji(String languageName) {
        return switch (languageName.toLowerCase()) {
            case "english" -> "🇬🇧";
            case "french", "français" -> "🇫🇷";
            case "german", "deutsch" -> "🇩🇪";
            case "spanish", "español" -> "🇪🇸";
            case "italian", "italiano" -> "🇮🇹";
            case "portuguese", "português" -> "🇵🇹";
            case "russian", "русский" -> "🇷🇺";
            case "chinese", "中文" -> "🇨🇳";
            case "japanese", "日本語" -> "🇯🇵";
            case "korean", "한국어" -> "🇰🇷";
            case "arabic", "العربية" -> "🇸🇦";
            case "romanian", "română" -> "🇷🇴";
            case "hungarian", "magyar" -> "🇭🇺";
            default -> "🌍"; // Default global icon
        };
    }

    /**
     * Extrage nivelul de limbă din skill (description sau proficiency)
     */
    private String extractLanguageLevel(Skill skill) {
        // 1. Încearcă din description
        if (skill.getDescription() != null) {
            String desc = skill.getDescription().toUpperCase();
            if (desc.contains("A1")) return "A1";
            if (desc.contains("A2")) return "A2";
            if (desc.contains("B1")) return "B1";
            if (desc.contains("B2")) return "B2";
            if (desc.contains("C1")) return "C1";
            if (desc.contains("C2")) return "C2";
            if (desc.contains("NATIVE")) return "Native";
            if (desc.contains("FLUENT")) return "C2";
        }

        // 2. Mapează din proficiency
        if (skill.getProficiency() != null) {
            return switch (skill.getProficiency()) {
                case BEGINNER -> "A1-A2";
                case INTERMEDIATE -> "B1-B2";
                case ADVANCED -> "C1";
                case EXPERT -> "C2";
            };
        }

        // 3. Estimează din level (0-100)
        if (skill.getLevel() != null) {
            int level = skill.getLevel();
            if (level >= 90) return "C2";
            if (level >= 80) return "C1";
            if (level >= 70) return "B2";
            if (level >= 60) return "B1";
            if (level >= 40) return "A2";
            return "A1";
        }

        return "Unknown";
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class EducationStatisticsDto {
    private Long totalEducation;
    private Long ongoingCount;
    private Long completedCount;
    private Map<String, Long> institutionDistribution;
    private Map<String, Long> fieldDistribution;
    private Map<EducationLevel, Long> levelDistribution;
    private Long featuredCount;

    public Double getCompletionRate() {
        if (totalEducation == 0) return 0.0;
        return ServiceUtils.calculatePercentage(completedCount, totalEducation);
    }

    public String getMostCommonLevel() {
        return levelDistribution.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> entry.getKey().toString().toLowerCase())
                .orElse("unknown");
    }

    public String getTopInstitution() {
        return ServiceUtils.findMostFrequent(
                institutionDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("Unknown");
    }
}

@lombok.Data
@lombok.Builder
class TimelineDataDto {
    private Integer year;
    private Long count;
    private String entityType;
}