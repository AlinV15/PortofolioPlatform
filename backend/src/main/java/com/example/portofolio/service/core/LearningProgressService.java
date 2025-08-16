package com.example.portofolio.service.core;

import com.example.portofolio.dto.LearningMilestoneDto;
import com.example.portofolio.dto.LearningProgressDto;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.*;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.BaseService;
import com.example.portofolio.service.base.ServiceUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service pentru gestionarea progresului de învățare
 */
@Service
@Slf4j
public class LearningProgressService extends BaseService<LearningProgress, Long, LearningProgressRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final EntityTechnologyRepository entityTechnologyRepository;

    @Autowired
    public LearningProgressService(LearningProgressRepository learningProgressRepository,
                                   EntityMetadataRepository entityMetadataRepository,
                                   SkillRepository skillRepository,
                                   ProjectRepository projectRepository,
                                   EntityTechnologyRepository entityTechnologyRepository) {
        super(learningProgressRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.skillRepository = skillRepository;
        this.entityTechnologyRepository = entityTechnologyRepository;
        this.projectRepository = projectRepository;

    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.LEARNING_PROGRESS.name();
    }

    @Override
    protected LearningProgressDto toDto(LearningProgress learningProgress) {
        return toLearningProgressDto(learningProgress);
    }

    // ===== CORE QUERIES =====

    @Cacheable(value = "learningProgressByPersonal", key = "#personalId")
    public List<LearningProgressDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> learningProgresses = repository.findByPersonalIdWithSkillAndCategory(personalId);
        List<LearningProgressDto> result = ServiceUtils.safeMap(learningProgresses, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    @Cacheable(value = "currentLearning", key = "#personalId")
    public List<LearningProgressDto> findCurrentLearning(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findCurrentLearning", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> currentLearning = repository.findCurrentLearningByPersonalId(personalId);
        List<LearningProgressDto> result = ServiceUtils.safeMap(currentLearning, this::toLearningProgressDto);

        log.debug("Found {} current learning items for personalId: {}", result.size(), personalId);
        ServiceUtils.logMethodExit("findCurrentLearning", result.size());
        return result;
    }

    @Cacheable(value = "completedLearning", key = "#personalId")
    public List<LearningProgressDto> findCompletedLearning(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findCompletedLearning", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> completedLearning = repository.findCompletedLearningByPersonalId(personalId);
        List<LearningProgressDto> result = ServiceUtils.safeMap(completedLearning, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findCompletedLearning", result.size());
        return result;
    }

    public List<LearningProgressDto> findByStatus(@Valid @NotNull @Positive Long personalId,
                                                  @Valid @NotNull LearningStatus status) {
        ServiceUtils.logMethodEntry("findByStatus", personalId, status);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> learningProgresses = repository.findByPersonalIdAndStatusWithSkill(personalId, status);
        List<LearningProgressDto> result = ServiceUtils.safeMap(learningProgresses, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findByStatus", result.size());
        return result;
    }

    // ===== ACTIVE LEARNING =====

    @Cacheable(value = "activeLearning", key = "#personalId")
    public List<LearningProgressDto> findActiveLearning(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findActiveLearning", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> activeLearning = repository.findActiveByPersonalId(personalId);
        List<LearningProgressDto> result = ServiceUtils.safeMap(activeLearning, this::toLearningProgressDto);

        log.debug("Found {} active learning items for personalId: {}", result.size(), personalId);
        ServiceUtils.logMethodExit("findActiveLearning", result.size());
        return result;
    }

    // ===== PROGRESS FILTERING =====

    public List<LearningProgressDto> findByMinProgress(@Valid @NotNull @Positive Long personalId,
                                                       @Valid @NotNull Integer minProgress) {
        ServiceUtils.logMethodEntry("findByMinProgress", personalId, minProgress);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> learningProgresses = repository.findByPersonalIdAndMinProgress(personalId, minProgress);
        List<LearningProgressDto> result = ServiceUtils.safeMap(learningProgresses, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findByMinProgress", result.size());
        return result;
    }

    public List<LearningProgressDto> findRecentLearning(@Valid @NotNull @Positive Long personalId,
                                                        @Valid @NotNull Integer days) {
        ServiceUtils.logMethodEntry("findRecentLearning", personalId, days);
        ServiceUtils.validatePersonalId(personalId);

        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<LearningProgress> recentLearning = repository.findRecentLearningByPersonalId(personalId, since);
        List<LearningProgressDto> result = ServiceUtils.safeMap(recentLearning, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findRecentLearning", result.size());
        return result;
    }

    // ===== TECHNOLOGY-BASED LEARNING =====

    public List<LearningProgressDto> findByTechnology(@Valid @NotNull @Positive Long personalId,
                                                      @Valid @NotNull @Positive Long technologyId) {
        ServiceUtils.logMethodEntry("findByTechnology", personalId, technologyId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningProgress> learningProgresses = repository.findByPersonalIdAndTechnologyId(personalId, technologyId);
        List<LearningProgressDto> result = ServiceUtils.safeMap(learningProgresses, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("findByTechnology", result.size());
        return result;
    }

    // ===== SEARCH =====

    public List<LearningProgressDto> searchLearning(@Valid @NotNull @Positive Long personalId,
                                                    @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchLearning", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<LearningProgress> learningProgresses = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<LearningProgressDto> result = ServiceUtils.safeMap(learningProgresses, this::toLearningProgressDto);

        ServiceUtils.logMethodExit("searchLearning", result.size());
        return result;
    }

    // ===== STATISTICS =====

    @Cacheable(value = "learningStats", key = "#personalId")
    public LearningStatisticsDto getLearningStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getLearningStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalLearning = repository.countByPersonalId(personalId);
        Double averageProgress = repository.findAverageProgressByPersonalId(personalId);
        Double totalTimeSpent = repository.findTotalTimeSpentByPersonalId(personalId);

        List<Object[]> statusDistribution = repository.countLearningProgressByStatus(personalId);
        Map<String, Long> statusStats = statusDistribution.stream()
                .collect(Collectors.toMap(
                        row -> ((LearningStatus) row[0]).name().toLowerCase(),
                        row -> ((Number) row[1]).longValue()
                ));

        LearningStatisticsDto result = LearningStatisticsDto.builder()
                .totalLearning(totalLearning)
                .averageProgress(averageProgress != null ? averageProgress : 0.0)
                .totalTimeSpent(totalTimeSpent != null ? totalTimeSpent.intValue() : 0)
                .statusDistribution(statusStats)
                .inProgressCount(statusStats.getOrDefault("in_progress", 0L))
                .completedCount(statusStats.getOrDefault("completed", 0L))
                .notStartedCount(statusStats.getOrDefault("not_started", 0L))
                .build();

        ServiceUtils.logMethodExit("getLearningStatistics", result);
        return result;
    }

    // Adaugă în LearningProgressService

    /**
     * Returnează toate milestone-urile de învățare pentru o persoană
     * Combină achievements și proiecte importante într-o listă unificată
     */
    @Cacheable(value = "learningMilestones", key = "#personalId")
    public List<LearningMilestoneDto> getLearningMilestones(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getLearningMilestones", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<LearningMilestoneDto> allMilestones = new ArrayList<>();

        // 1. ===== MILESTONE-URI DIN PROIECTE COMPLETATE =====
        List<Project> completedProjects = projectRepository.findCompletedProjectsAsAchievements(personalId, Pageable.unpaged());

        List<LearningMilestoneDto> projectMilestones = completedProjects.stream()
                .map(project -> {
                    // Obține tehnologiile pentru proiect
                    List<String> technologies = entityTechnologyRepository
                            .findByEntityTypeAndEntityIdWithTechnology(EntityType.PROJECT, project.getId())
                            .stream()
                            .map(et -> et.getTechnology().getName())
                            .toList();

                    return LearningMilestoneDto.builder()
                            .id(project.getId().toString())
                            .title(project.getTitle())
                            .year(project.getYear() != null ? project.getYear().toString() :
                                    project.getCompletionDate() != null ?
                                            String.valueOf(project.getCompletionDate().getYear()) :
                                            String.valueOf(LocalDate.now().getYear()))
                            .description(project.getDescription())
                            .technologies(technologies)
                            .build();
                })
                .toList();

        allMilestones.addAll(projectMilestones);

        // 2. ===== MILESTONE-URI DIN SKILL-URI EXPERT =====
        List<Skill> expertSkills = skillRepository.findByPersonalId(personalId).stream()
                .filter(skill -> skill.getLevel() != null && skill.getLevel() >= 90)
                .toList();

        List<LearningMilestoneDto> skillMilestones = expertSkills.stream()
                .map(skill -> {
                    // Obține tehnologiile asociate cu skill-ul
                    List<String> technologies = entityTechnologyRepository
                            .findByEntityTypeAndEntityIdWithTechnology(EntityType.SKILL, skill.getId())
                            .stream()
                            .map(et -> et.getTechnology().getName())
                            .toList();

                    // Dacă nu are tehnologii asociate, folosește numele skill-ului
                    if (technologies.isEmpty()) {
                        technologies = List.of(skill.getName());
                    }

                    String year = skill.getUpdatedAt() != null ?
                            String.valueOf(skill.getUpdatedAt().getYear()) :
                            String.valueOf(LocalDate.now().getYear());

                    return LearningMilestoneDto.builder()
                            .id("skill_" + skill.getId().toString()) // Prefix pentru diferențiere
                            .title("Expert Level: " + skill.getName())
                            .year(year)
                            .description("Achieved expert level (90%+) in " + skill.getName())
                            .technologies(technologies)
                            .build();
                })
                .toList();

        allMilestones.addAll(skillMilestones);

        // 3. ===== MILESTONE-URI DIN LEARNING PROGRESS COMPLETAT =====
        List<LearningProgress> completedLearning = repository.findCompletedLearningByPersonalId(personalId);

        List<LearningMilestoneDto> learningMilestones = completedLearning.stream()
                .map(learning -> {
                    // Obține tehnologiile pentru skill-ul asociat
                    List<String> technologies = entityTechnologyRepository
                            .findByEntityTypeAndEntityIdWithTechnology(EntityType.SKILL, learning.getSkill().getId())
                            .stream()
                            .map(et -> et.getTechnology().getName())
                            .toList();

                    // Fallback la numele skill-ului
                    if (technologies.isEmpty()) {
                        technologies = List.of(learning.getSkill().getName());
                    }

                    String year = learning.getCompletionDate() != null ?
                            String.valueOf(learning.getCompletionDate().getYear()) :
                            String.valueOf(LocalDate.now().getYear());

                    return LearningMilestoneDto.builder()
                            .id("learning_" + learning.getId().toString()) // Prefix pentru diferențiere
                            .title("Completed: " + learning.getName())
                            .year(year)
                            .description(learning.getDescription())
                            .technologies(technologies)
                            .build();
                })
                .toList();

        allMilestones.addAll(learningMilestones);

        // 4. ===== SORTARE ȘI RETURNARE =====
        List<LearningMilestoneDto> result = allMilestones.stream()
                .sorted((m1, m2) -> {
                    // Sortează descrescător după an
                    try {
                        int year1 = Integer.parseInt(m1.getYear());
                        int year2 = Integer.parseInt(m2.getYear());
                        return Integer.compare(year2, year1);
                    } catch (NumberFormatException e) {
                        return m2.getYear().compareTo(m1.getYear());
                    }
                })
                .toList();

        log.debug("Found {} learning milestones for personalId: {}", result.size(), personalId);
        ServiceUtils.logMethodExit("getLearningMilestones", result.size());
        return result;
    }

    // ===== DTO CONVERSION =====

    private LearningProgressDto toLearningProgressDto(LearningProgress learningProgress) {
        // Obține culoarea din metadata pentru skill
        Optional<EntityMetadata> skillMetadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, learningProgress.getSkill().getId());

        String color = skillMetadata
                .map(EntityMetadata::getPrimaryColor)
                .orElse(getDefaultColorByProgress(learningProgress.getProgressPercentage()));

        // Formatează ETA
        String eta = null;
        if (learningProgress.getEstimatedCompletion() != null &&
                !learningProgress.getEstimatedCompletion().trim().isEmpty()) {
            try {
                eta = formatEta(LocalDateTime.parse(learningProgress.getEstimatedCompletion()));
            } catch (Exception e) {
                log.warn("Could not parse estimated completion date: {}",
                        learningProgress.getEstimatedCompletion(), e);
            }
        }

        return LearningProgressDto.builder()
                .id(learningProgress.getId().toString())
                .name(learningProgress.getName())
                .progress(learningProgress.getProgressPercentage())
                .color(color)
                .timeSpent(learningProgress.getTimeSpentHours() != null ?
                        learningProgress.getTimeSpentHours().intValue() : 0)
                .eta(eta)
                .description(learningProgress.getDescription())
                .build();
    }

    // ===== HELPER METHODS =====

    private String getDefaultColorByProgress(Integer progress) {
        if (progress == null) return "#6B7280"; // Gray

        if (progress >= 80) return "#10B981"; // Green - Almost done
        if (progress >= 60) return "#F59E0B"; // Yellow - Good progress
        if (progress >= 30) return "#3B82F6"; // Blue - Getting there
        return "#EF4444"; // Red - Just started
    }

    private String formatEta(LocalDateTime estimatedCompletion) {
        if (estimatedCompletion == null) return null;

        return estimatedCompletion.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<LearningProgress> findFeatured() {
        // Poate returna learning progress-urile cu progres mare sau importante
        return repository.findAll().stream()
                .filter(lp -> lp.getProgressPercentage() != null && lp.getProgressPercentage() >= 80)
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        // Verifică dacă skill-ul asociat are metadata
        Optional<LearningProgress> learningProgress = repository.findById(id);
        if (learningProgress.isPresent() && learningProgress.get().getSkill() != null) {
            return entityMetadataRepository
                    .findByEntityTypeAndEntityId(EntityType.SKILL, learningProgress.get().getSkill().getId())
                    .isPresent();
        }
        return false;
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class LearningStatisticsDto {
    private Long totalLearning;
    private Double averageProgress;
    private Integer totalTimeSpent;
    private Map<String, Long> statusDistribution;
    private Long inProgressCount;
    private Long completedCount;
    private Long notStartedCount;

    public Double getCompletionRate() {
        if (totalLearning == 0) return 0.0;
        return (completedCount.doubleValue() / totalLearning.doubleValue()) * 100.0;
    }

    public Integer getEstimatedRemainingHours() {
        if (averageProgress >= 100.0) return 0;

        // Estimare simplă bazată pe progresul mediu și timpul petrecut
        double remainingProgress = 100.0 - averageProgress;
        double progressRate = averageProgress / Math.max(totalTimeSpent, 1);

        return (int) Math.ceil(remainingProgress / progressRate);
    }
}