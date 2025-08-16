package com.example.portofolio.service.personal;

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
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Hobby Service with ServiceUtils
 */
@Service
@Slf4j
public class HobbyService extends BaseService<Hobby, Long, HobbyRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final AchievementRepository achievementRepository;

    @Autowired
    public HobbyService(HobbyRepository hobbyRepository,
                        EntityMetadataRepository entityMetadataRepository,
                        AchievementRepository achievementRepository) {
        super(hobbyRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.HOBBY.name();
    }

    @Override
    protected HobbyDto toDto(Hobby hobby) {
        return toHobbyDto(hobby);
    }

    // ===== CORE HOBBY QUERIES (folosind metodele exacte din repository) =====

    @Cacheable(value = "hobbiesByPersonal", key = "#personalId")
    public List<HobbyDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findByPersonalId(personalId);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    public List<HobbyDto> findByPersonalIdAndCategory(@Valid @NotNull @Positive Long personalId,
                                                      @Valid @NotNull HobbyCategory category) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndCategory", personalId, category);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findByPersonalIdAndCategory(personalId, category);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndCategory", result.size());
        return result;
    }

    public List<HobbyDto> findByPersonalIdAndActivityLevel(@Valid @NotNull @Positive Long personalId,
                                                           @Valid @NotNull ActivityLevel activityLevel) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndActivityLevel", personalId, activityLevel);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findByPersonalIdAndActivityLevel(personalId, activityLevel);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndActivityLevel", result.size());
        return result;
    }

    public List<HobbyDto> findByPersonalIdOrderByYearsActive(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalIdOrderByYearsActive", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findByPersonalIdOrderByYearsActiveDesc(personalId);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdOrderByYearsActive", result.size());
        return result;
    }

    @Cacheable(value = "featuredHobbies", key = "#personalId")
    public List<HobbyDto> findFeaturedHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFeaturedHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findFeaturedByPersonalId(personalId);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findFeaturedHobbies", result.size());
        return result;
    }

    @Cacheable(value = "activeHobbies", key = "#personalId")
    public List<HobbyDto> findActiveHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findActiveHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Hobby> hobbies = repository.findActiveHobbiesByPersonalId(personalId);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findActiveHobbies", result.size());
        return result;
    }

    public List<HobbyDto> findByMinYearsActive(@Valid @NotNull @Positive Long personalId,
                                               @Valid @NotNull BigDecimal minYears) {
        ServiceUtils.logMethodEntry("findByMinYearsActive", personalId, minYears);
        ServiceUtils.validatePersonalId(personalId);
        validateYearsActive(minYears);

        List<Hobby> hobbies = repository.findByPersonalIdAndMinYearsActive(personalId, minYears);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findByMinYearsActive", result.size());
        return result;
    }

    // ===== SEARCH METHODS (folosind metodele exacte) =====

    public List<HobbyDto> searchHobbies(@Valid @NotNull @Positive Long personalId,
                                        @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchHobbies", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Hobby> hobbies = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<HobbyDto> result = hobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("searchHobbies", result.size());
        return result;
    }

    // ===== STATISTICS METHODS (folosind metodele exacte) =====

    @Cacheable(value = "hobbyStats", key = "#personalId")
    public HobbyStatisticsDto getHobbyStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getHobbyStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalHobbies = repository.countByPersonalId(personalId);
        BigDecimal avgYearsActive = repository.findAverageYearsActiveByPersonalId(personalId);

        // Get category distribution
        List<Object[]> categoryResults = repository.countHobbiesByCategory(personalId);
        Map<String, Long> categoryDistribution = categoryResults.stream().collect(Collectors.toMap(
                row -> ((HobbyCategory) row[0]).toString().toLowerCase(),
                row -> ((Number) row[1]).longValue()
        ));

        // Calculate activity level distribution
        Map<String, Long> activityDistribution = calculateActivityLevelDistribution(personalId);

        // Get featured count
        Long featuredCount = (long) findFeaturedHobbies(personalId).size();
        Long activeCount = (long) findActiveHobbies(personalId).size();

        HobbyStatisticsDto result = HobbyStatisticsDto.builder()
                .totalHobbies(totalHobbies)
                .averageYearsActive(avgYearsActive != null ? avgYearsActive.doubleValue() : 0.0)
                .categoryDistribution(categoryDistribution)
                .activityDistribution(activityDistribution)
                .featuredCount(featuredCount)
                .activeCount(activeCount)
                .longTermCount(countLongTermHobbies(personalId))
                .build();

        ServiceUtils.logMethodExit("getHobbyStatistics", result);
        return result;
    }

    // ===== CATEGORY-BASED QUERIES =====

    public List<HobbyDto> findCreativeHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findCreativeHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, HobbyCategory.CREATIVE);
    }

    public List<HobbyDto> findSportsHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findSportsHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, HobbyCategory.SPORTS);
    }

    public List<HobbyDto> findTechHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findTechHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, HobbyCategory.TECHNOLOGY);
    }

    public List<HobbyDto> findLearningHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findLearningHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, HobbyCategory.LEARNING);
    }

    // ===== ACTIVITY LEVEL QUERIES =====

    public List<HobbyDto> findDailyHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findDailyHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndActivityLevel(personalId, ActivityLevel.DAILY);
    }

    public List<HobbyDto> findFrequentHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFrequentHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndActivityLevel(personalId, ActivityLevel.FREQUENT);
    }

    // ===== EXPERIENCE-BASED QUERIES =====

    public List<HobbyDto> findLongTermHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findLongTermHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // Long term = 3+ years
        BigDecimal minYears = new BigDecimal("3.0");
        return findByMinYearsActive(personalId, minYears);
    }

    public List<HobbyDto> findNewHobbies(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findNewHobbies", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // New hobbies = less than 1 year
        List<Hobby> allHobbies = repository.findByPersonalId(personalId);
        List<Hobby> newHobbies = allHobbies.stream()
                .filter(hobby -> hobby.getYearsActive() != null &&
                        hobby.getYearsActive().compareTo(1L) < 0)
                .toList();

        List<HobbyDto> result = newHobbies.stream()
                .map(this::toHobbyDto)
                .toList();

        ServiceUtils.logMethodExit("findNewHobbies", result.size());
        return result;
    }

    // ===== ACHIEVEMENTS INTEGRATION =====

    public List<AchievementDto> findHobbyAchievements(@Valid @NotNull @Positive Long personalId,
                                                      @Valid @NotNull @Positive Long hobbyId) {
        ServiceUtils.logMethodEntry("findHobbyAchievements", personalId, hobbyId);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateEntityId(hobbyId);

        List<Achievement> achievements = achievementRepository
                .findByPersonalIdAndEntityTypeAndEntityId(personalId, EntityType.HOBBY, hobbyId);
        List<AchievementDto> result = achievements.stream()
                .map(this::toAchievementDto)
                .toList();

        ServiceUtils.logMethodExit("findHobbyAchievements", result.size());
        return result;
    }

    // ===== DTO CONVERSION =====

    private HobbyDto toHobbyDto(Hobby hobby) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.HOBBY, hobby.getId());

        // Get achievements for this hobby
        List<AchievementDto> achievements = findHobbyAchievements(
                hobby.getPersonal().getId(), hobby.getId());

        // Get related skills (simplified - could be enhanced)
        List<String> relatedSkills = getRelatedSkills(hobby);

        // Determine colors based on category and activity level
        String defaultColor = getColorForHobbyCategory(hobby.getCategory());
        String defaultIcon = getIconForHobbyCategory(hobby.getCategory());

        return HobbyDto.builder()
                .id(hobby.getId().toString())
                .name(hobby.getName())
                .description(ServiceUtils.truncateText(hobby.getDescription(), 300))
                .icon(ServiceUtils.getIconFromMetadata(metadata, defaultIcon))
                .category(ServiceUtils.enumToLowerString(hobby.getCategory()))
                .yearsActive(hobby.getYearsActive() != null ? hobby.getYearsActive().doubleValue() : null)
                .complexityLevel(ServiceUtils.enumToLowerString(hobby.getComplexityLevel()))
                .relatedSkills(relatedSkills)
                .impactOnWork(ServiceUtils.enumToLowerString(hobby.getImpactOnWork()))
                .favoriteAspect(hobby.getFavoriteAspect())
                .achievements(achievements)
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, defaultColor))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, getLightColorForHobbyCategory(hobby.getCategory())))
                .build();
    }

    private AchievementDto toAchievementDto(Achievement achievement) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, achievement.getId());

        String formattedDate = ServiceUtils.formatDateAsIso(achievement.getAchievementDate());

        return AchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(ServiceUtils.truncateText(achievement.getDescription(), 200))
                .date(formattedDate)
                .type(ServiceUtils.enumToLowerString(achievement.getAchievementType()))
                .icon(ServiceUtils.getIconFromMetadata(metadata, "award"))
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, "#F59E0B"))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, "#FEF3C7"))
                .recognitionLevel(ServiceUtils.enumToLowerString(achievement.getRecognitionLevel()))
                .build();
    }

    // ===== HELPER METHODS =====

    private Map<String, Long> calculateActivityLevelDistribution(Long personalId) {
        List<Hobby> hobbies = repository.findByPersonalId(personalId);

        return hobbies.stream()
                .filter(hobby -> hobby.getActivityLevel() != null)
                .collect(Collectors.groupingBy(
                        hobby -> hobby.getActivityLevel().toString().toLowerCase(),
                        Collectors.counting()
                ));
    }

    private Long countLongTermHobbies(Long personalId) {
        BigDecimal minYears = new BigDecimal("3.0");
        return (long) findByMinYearsActive(personalId, minYears).size();
    }

    private List<String> getRelatedSkills(Hobby hobby) {
        // Simplified implementation - could be enhanced with actual skill relationships
        // For now, return empty list or derive from hobby category
        return List.of();
    }

    private String getColorForHobbyCategory(HobbyCategory category) {
        if (category == null) return "#6B7280"; // Gray

        return switch (category) {
            case CREATIVE -> "#EC4899"; // Pink
            case SPORTS -> "#10B981"; // Green
            case TECHNOLOGY -> "#3B82F6"; // Blue
            case LEARNING -> "#8B5CF6"; // Purple
            case MUSIC -> "#F59E0B"; // Amber
            case TRAVEL -> "#06B6D4"; // Cyan
            case COOKING -> "#EF4444"; // Red
            case GARDENING -> "#84CC16"; // Lime
            case READING -> "#6366F1"; // Indigo
            case GAMING -> "#F97316"; // Orange
            case SOCIAL -> "#3619f7"; // Blue
        };
    }

    private String getLightColorForHobbyCategory(HobbyCategory category) {
        if (category == null) return "#F3F4F6"; // Light Gray

        return switch (category) {
            case CREATIVE -> "#FCE7F3"; // Light Pink
            case SPORTS -> "#D1FAE5"; // Light Green
            case TECHNOLOGY -> "#DBEAFE"; // Light Blue
            case LEARNING -> "#F3E8FF"; // Light Purple
            case MUSIC -> "#FEF3C7"; // Light Amber
            case TRAVEL -> "#CFFAFE"; // Light Cyan
            case COOKING -> "#FEE2E2"; // Light Red
            case GARDENING -> "#ECFCCB"; // Light Lime
            case READING -> "#E0E7FF"; // Light Indigo
            case GAMING -> "#FED7AA"; // Light Orange
            case SOCIAL -> "#CFFAFE";
        };
    }

    private String getIconForHobbyCategory(HobbyCategory category) {
        if (category == null) return "heart";

        return switch (category) {
            case CREATIVE -> "palette";
            case SPORTS -> "activity";
            case TECHNOLOGY -> "code";
            case LEARNING -> "book-open";
            case MUSIC -> "music";
            case TRAVEL -> "map-pin";
            case COOKING -> "chef-hat";
            case GARDENING -> "flower";
            case READING -> "book";
            case GAMING -> "gamepad-2";
            case SOCIAL -> "people";
        };
    }

    // ===== VALIDATION HELPERS =====

    private void validateYearsActive(BigDecimal years) {
        if (years == null) {
            throw new IllegalArgumentException("Years active cannot be null");
        }
        if (years.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Years active cannot be negative");
        }
        if (years.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Years active cannot exceed 100");
        }
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Hobby> findFeatured() {
        return repository.findAll().stream()
                .filter(hobby -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.HOBBY, hobby.getId());
                    return ServiceUtils.isFeatured(metadata);
                })
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.HOBBY, id)
                .isPresent();
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class HobbyStatisticsDto {
    private Long totalHobbies;
    private Double averageYearsActive;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> activityDistribution;
    private Long featuredCount;
    private Long activeCount;
    private Long longTermCount;

    public Double getFeaturedPercentage() {
        if (totalHobbies == 0) return 0.0;
        return ServiceUtils.calculatePercentage(featuredCount, totalHobbies);
    }

    public Double getActivePercentage() {
        if (totalHobbies == 0) return 0.0;
        return ServiceUtils.calculatePercentage(activeCount, totalHobbies);
    }

    public String getMostCommonCategory() {
        return ServiceUtils.findMostFrequent(
                categoryDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("unknown");
    }

    public String getMostCommonActivityLevel() {
        return ServiceUtils.findMostFrequent(
                activityDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("occasional");
    }

    public Boolean hasLongTermCommitment() {
        return longTermCount != null && longTermCount > 0;
    }
}