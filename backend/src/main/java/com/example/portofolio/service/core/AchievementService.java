package com.example.portofolio.service.core;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.*;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.BaseService;
import com.example.portofolio.service.base.ServiceUtils;
import lombok.Builder;
import lombok.Data;
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
 * Achievement Service with ServiceUtils
 */
@Service
@Slf4j
public class AchievementService extends BaseService<Achievement, Long, AchievementRepository> {

    private final EntityMetadataRepository entityMetadataRepository;

    @Autowired
    public AchievementService(AchievementRepository achievementRepository,
                              EntityMetadataRepository entityMetadataRepository) {
        super(achievementRepository);
        this.entityMetadataRepository = entityMetadataRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.ACHIEVEMENT.name();
    }

    @Override
    protected AchievementDto toDto(Achievement achievement) {
        return toAchievementDto(achievement);
    }

    // ===== CORE ACHIEVEMENT QUERIES =====

    @Cacheable(value = "achievementsByPersonal", key = "#personalId")
    public List<AchievementDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalIdOrderByAchievementDateDesc(personalId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    public List<AchievementDto> findByPersonalIdAndType(@Valid @NotNull @Positive Long personalId,
                                                        @Valid @NotNull AchievementType type) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndType", personalId, type);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalIdAndAchievementType(personalId, type);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndType", result.size());
        return result;
    }

    public List<AchievementDto> findByPersonalIdAndTypes(@Valid @NotNull @Positive Long personalId,
                                                         @Valid @NotNull List<AchievementType> types) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndTypes", personalId, types);
        ServiceUtils.validatePersonalId(personalId);

        if (types == null || types.isEmpty()) {
            throw new IllegalArgumentException("Achievement types list cannot be empty");
        }

        List<Achievement> achievements = repository.findByPersonalIdAndAchievementTypeIn(personalId, types);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndTypes", result.size());
        return result;
    }

    public List<AchievementDto> findByPersonalIdAndRecognitionLevel(@Valid @NotNull @Positive Long personalId,
                                                                    @Valid @NotNull RecognitionLevel level) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndRecognitionLevel", personalId, level);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalIdAndRecognitionLevel(personalId, level);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndRecognitionLevel", result.size());
        return result;
    }

    @Cacheable(value = "highRecognitionAchievements", key = "#personalId")
    public List<AchievementDto> findHighRecognitionAchievements(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findHighRecognitionAchievements", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findHighRecognitionByPersonalId(personalId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findHighRecognitionAchievements", result.size());
        return result;
    }

    @Cacheable(value = "featuredAchievements", key = "#personalId")
    public List<AchievementDto> findFeaturedAchievements(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFeaturedAchievements", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findFeaturedByPersonalId(personalId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findFeaturedAchievements", result.size());
        return result;
    }

    // ===== ENTITY-RELATED ACHIEVEMENTS =====

    public List<AchievementDto> findByEntityTypeAndEntityId(@Valid @NotNull @Positive Long personalId,
                                                            @Valid @NotNull EntityType entityType,
                                                            @Valid @NotNull @Positive Long entityId) {
        ServiceUtils.logMethodEntry("findByEntityTypeAndEntityId", personalId, entityType, entityId);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateEntityId(entityId);

        List<Achievement> achievements = repository.findByPersonalIdAndEntityTypeAndEntityId(
                personalId, entityType, entityId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByEntityTypeAndEntityId", result.size());
        return result;
    }

    public List<AchievementDto> findByEntityType(@Valid @NotNull @Positive Long personalId,
                                                 @Valid @NotNull EntityType entityType) {
        ServiceUtils.logMethodEntry("findByEntityType", personalId, entityType);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalIdAndEntityType(personalId, entityType);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByEntityType", result.size());
        return result;
    }

    // ===== DATE-BASED QUERIES =====

    public List<AchievementDto> findRecentAchievements(@Valid @NotNull @Positive Long personalId,
                                                       @Valid @NotNull Integer days) {
        ServiceUtils.logMethodEntry("findRecentAchievements", personalId, days);
        ServiceUtils.validatePersonalId(personalId);

        if (days <= 0) {
            throw new IllegalArgumentException("Days must be positive");
        }

        LocalDate since = LocalDate.now().minusDays(days);
        List<Achievement> achievements = repository.findRecentByPersonalId(personalId, since);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findRecentAchievements", result.size());
        return result;
    }

    public List<AchievementDto> findByDateRange(@Valid @NotNull @Positive Long personalId,
                                                @Valid @NotNull LocalDate startDate,
                                                @Valid @NotNull LocalDate endDate) {
        ServiceUtils.logMethodEntry("findByDateRange", personalId, startDate, endDate);
        ServiceUtils.validatePersonalId(personalId);

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        List<Achievement> achievements = repository.findByPersonalIdAndDateBetween(personalId, startDate, endDate);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByDateRange", result.size());
        return result;
    }

    public List<AchievementDto> findByYear(@Valid @NotNull @Positive Long personalId,
                                           @Valid @NotNull Integer year) {
        ServiceUtils.logMethodEntry("findByYear", personalId, year);
        ServiceUtils.validatePersonalId(personalId);

        if (year < 1900 || year > LocalDate.now().getYear() + 10) {
            throw new IllegalArgumentException("Invalid year: " + year);
        }

        List<Achievement> achievements = repository.findByPersonalIdAndYear(personalId, year);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByYear", result.size());
        return result;
    }

    // ===== SEARCH =====

    public List<AchievementDto> searchAchievements(@Valid @NotNull @Positive Long personalId,
                                                   @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchAchievements", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Achievement> achievements = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("searchAchievements", result.size());
        return result;
    }

    // ===== AWARD BODY QUERIES =====

    public List<AchievementDto> findByAwardBody(@Valid @NotNull @Positive Long personalId,
                                                @Valid @NotNull String awardBody) {
        ServiceUtils.logMethodEntry("findByAwardBody", personalId, awardBody);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalIdAndAwardBody(personalId, awardBody);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findByAwardBody", result.size());
        return result;
    }

    @Cacheable(value = "achievementsByAwardBody", key = "#personalId")
    public Map<String, Long> getAchievementsByAwardBody(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAchievementsByAwardBody", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.countAchievementsByAwardBody(personalId);
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getAchievementsByAwardBody", stats.size());
        return stats;
    }

    // ===== STATISTICS =====

    @Cacheable(value = "achievementStats", key = "#personalId")
    public AchievementStatisticsDto getAchievementStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAchievementStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalAchievements = repository.countByPersonalId(personalId);

        // Type distribution
        List<Object[]> typeResults = repository.countAchievementsByType(personalId);
        Map<String, Long> typeDistribution = typeResults.stream().collect(Collectors.toMap(
                row -> ((AchievementType) row[0]).toString().toLowerCase(),
                row -> ((Number) row[1]).longValue()
        ));

        // Recognition level distribution
        List<Object[]> levelResults = repository.countAchievementsByRecognitionLevel(personalId);
        Map<String, Long> recognitionDistribution = levelResults.stream().collect(Collectors.toMap(
                row -> ((RecognitionLevel) row[0]).toString().toLowerCase(),
                row -> ((Number) row[1]).longValue()
        ));

        // Award body distribution
        Map<String, Long> awardBodyStats = getAchievementsByAwardBody(personalId);

        AchievementStatisticsDto result = AchievementStatisticsDto.builder()
                .totalAchievements(totalAchievements)
                .typeDistribution(typeDistribution)
                .recognitionDistribution(recognitionDistribution)
                .awardBodyDistribution(awardBodyStats)
                .featuredCount((long) findFeaturedAchievements(personalId).size())
                .highRecognitionCount((long) findHighRecognitionAchievements(personalId).size())
                .recentCount((long) findRecentAchievements(personalId, 365).size()) // Last year
                .build();

        ServiceUtils.logMethodExit("getAchievementStatistics", result);
        return result;
    }

    @Cacheable(value = "achievementTimeline", key = "#personalId")
    public List<TimelineDataDto> getAchievementTimeline(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAchievementTimeline", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.getAchievementTimelineByPersonalId(personalId);
        List<TimelineDataDto> timeline = results.stream()
                .map(row -> TimelineDataDto.builder()
                        .year(((Number) row[0]).intValue())
                        .count(((Number) row[1]).longValue())
                        .entityType("ACHIEVEMENT")
                        .build())
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .toList();

        ServiceUtils.logMethodExit("getAchievementTimeline", timeline.size());
        return timeline;
    }

    // ===== UTILITY METHODS =====

    public List<Integer> getAvailableYears(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAvailableYears", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalId(personalId);
        List<Integer> years = achievements.stream()
                .map(Achievement::getAchievementDate)
                .filter(Objects::nonNull)
                .map(LocalDate::getYear)
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .toList();

        ServiceUtils.logMethodExit("getAvailableYears", years.size());
        return years;
    }

    public List<String> getAvailableAwardBodies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAvailableAwardBodies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Achievement> achievements = repository.findByPersonalId(personalId);
        List<String> awardBodies = achievements.stream()
                .map(Achievement::getAwardBody)
                .filter(Objects::nonNull)
                .filter(body -> !body.trim().isEmpty())
                .distinct()
                .sorted()
                .toList();

        ServiceUtils.logMethodExit("getAvailableAwardBodies", awardBodies.size());
        return awardBodies;
    }

    // ===== DTO CONVERSION =====

    private AchievementDto toAchievementDto(Achievement achievement) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, achievement.getId());

        String formattedDate = ServiceUtils.formatDateAsIso(achievement.getAchievementDate());

        // Determine color based on recognition level
        String defaultColor = getColorForRecognitionLevel(achievement.getRecognitionLevel());
        String defaultIcon = getIconForAchievementType(achievement.getAchievementType());

        return AchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(ServiceUtils.truncateText(achievement.getDescription(), 300))
                .date(formattedDate)
                .type(ServiceUtils.enumToLowerString(achievement.getAchievementType()))
                .icon(ServiceUtils.getIconFromMetadata(metadata, defaultIcon))
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, defaultColor))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, getLightColorForRecognitionLevel(achievement.getRecognitionLevel())))
                .recognitionLevel(ServiceUtils.enumToLowerString(achievement.getRecognitionLevel()))
                .build();
    }

    // ===== HELPER METHODS =====

    private String getColorForRecognitionLevel(RecognitionLevel level) {
        if (level == null) return "#6B7280"; // Gray

        return switch (level) {
            case INTERNATIONAL -> "#7C3AED"; // Purple
            case NATIONAL -> "#DC2626"; // Red
            case REGIONAL -> "#EA580C"; // Orange
            case LOCAL -> "#059669"; // Green
            case INSTITUTIONAL -> "#0284C7"; // Blue
        };
    }

    private String getLightColorForRecognitionLevel(RecognitionLevel level) {
        if (level == null) return "#F3F4F6"; // Light Gray

        return switch (level) {
            case INTERNATIONAL -> "#EDE9FE"; // Light Purple
            case NATIONAL -> "#FEE2E2"; // Light Red
            case REGIONAL -> "#FED7AA"; // Light Orange
            case LOCAL -> "#D1FAE5"; // Light Green
            case INSTITUTIONAL -> "#DBEAFE"; // Light Blue
        };
    }

    private String getIconForAchievementType(AchievementType type) {
        if (type == null) return "award";

        return switch (type) {
            case ACADEMIC -> "graduation-cap";
            case PROFESSIONAL -> "briefcase";
            case TECHNICAL -> "code";
            case RESEARCH -> "beaker";
            case LEADERSHIP -> "users";
            case PROJECT -> "puzzle";
            case HOBBY -> "ball";
            case VOLUNTEER -> "heart";
            case COMPETITION -> "trophy";
            case CERTIFICATION -> "certificate";
            case PUBLICATION -> "book-open";
            case PATENT -> "lightbulb";
            case AWARD -> "award";
            case RECOGNITION -> "star";
        };
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Achievement> findFeatured() {
        return repository.findAll().stream()
                .filter(achievement -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, achievement.getId());
                    return ServiceUtils.isFeatured(metadata);
                })
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, id)
                .isPresent();
    }
}

// ===== SUPPORTING CLASSES =====

@Data
@Builder
class AchievementStatisticsDto {
    private Long totalAchievements;
    private Map<String, Long> typeDistribution;
    private Map<String, Long> recognitionDistribution;
    private Map<String, Long> awardBodyDistribution;
    private Long featuredCount;
    private Long highRecognitionCount;
    private Long recentCount;

    public Double getFeaturedPercentage() {
        if (totalAchievements == 0) return 0.0;
        return ServiceUtils.calculatePercentage(featuredCount, totalAchievements);
    }

    public Double getHighRecognitionPercentage() {
        if (totalAchievements == 0) return 0.0;
        return ServiceUtils.calculatePercentage(highRecognitionCount, totalAchievements);
    }

    public String getMostCommonType() {
        return ServiceUtils.findMostFrequent(
                typeDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("unknown");
    }

    public String getTopAwardBody() {
        return ServiceUtils.findMostFrequent(
                awardBodyDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("Unknown");
    }
}
