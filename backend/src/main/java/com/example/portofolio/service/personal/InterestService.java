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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Interest Service with ServiceUtils
 */
@Service
@Slf4j
public class InterestService extends BaseService<Interest, Long, InterestRepository> {

    private final EntityMetadataRepository entityMetadataRepository;

    @Autowired
    public InterestService(InterestRepository interestRepository,
                           EntityMetadataRepository entityMetadataRepository) {
        super(interestRepository);
        this.entityMetadataRepository = entityMetadataRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.INTEREST.name();
    }

    @Override
    protected InterestDto toDto(Interest interest) {
        return toInterestDto(interest);
    }

    // ===== CORE INTEREST QUERIES (folosind metodele exacte din repository) =====

    @Cacheable(value = "interestsByPersonal", key = "#personalId")
    public List<InterestDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findByPersonalId(personalId);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    public List<InterestDto> findByPersonalIdAndCategory(@Valid @NotNull @Positive Long personalId,
                                                         @Valid @NotNull InterestCategory category) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndCategory", personalId, category);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findByPersonalIdAndCategory(personalId, category);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndCategory", result.size());
        return result;
    }

    public List<InterestDto> findByPersonalIdAndIntensity(@Valid @NotNull @Positive Long personalId,
                                                          @Valid @NotNull IntensityLevel intensity) {
        ServiceUtils.logMethodEntry("findByPersonalIdAndIntensity", personalId, intensity);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findByPersonalIdAndIntensity(personalId, intensity);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdAndIntensity", result.size());
        return result;
    }

    @Cacheable(value = "interestsWithDiscoveries", key = "#personalId")
    public List<InterestDto> findByPersonalIdWithDiscoveries(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalIdWithDiscoveries", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findByPersonalIdWithDiscoveries(personalId);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDtoWithDiscoveries)
                .toList();

        ServiceUtils.logMethodExit("findByPersonalIdWithDiscoveries", result.size());
        return result;
    }

    @Cacheable(value = "featuredInterests", key = "#personalId")
    public List<InterestDto> findFeaturedInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFeaturedInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findFeaturedByPersonalId(personalId);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("findFeaturedInterests", result.size());
        return result;
    }

    @Cacheable(value = "passionateInterests", key = "#personalId")
    public List<InterestDto> findPassionateInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findPassionateInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findPassionateInterestsByPersonalId(personalId);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("findPassionateInterests", result.size());
        return result;
    }

    // ===== SEARCH METHODS (folosind metodele exacte) =====

    public List<InterestDto> searchInterests(@Valid @NotNull @Positive Long personalId,
                                             @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchInterests", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Interest> interests = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<InterestDto> result = interests.stream()
                .map(this::toInterestDto)
                .toList();

        ServiceUtils.logMethodExit("searchInterests", result.size());
        return result;
    }

    // ===== CATEGORY-BASED QUERIES =====

    public List<InterestDto> findTechnologyInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findTechnologyInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, InterestCategory.TECHNOLOGY);
    }

    public List<InterestDto> findScienceInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findScienceInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, InterestCategory.SCIENCE);
    }

    public List<InterestDto> findArtsInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findArtsInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, InterestCategory.ARTS);
    }

    public List<InterestDto> findBusinessInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findBusinessInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, InterestCategory.BUSINESS);
    }

    public List<InterestDto> findHealthInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findHealthInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndCategory(personalId, InterestCategory.HEALTH);
    }

    // ===== INTENSITY-BASED QUERIES =====

    public List<InterestDto> findHighIntensityInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findHighIntensityInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // High intensity includes PASSIONATE and HIGH levels
        List<InterestDto> passionate = findByPersonalIdAndIntensity(personalId, IntensityLevel.PASSIONATE);
        List<InterestDto> high = findByPersonalIdAndIntensity(personalId, IntensityLevel.PASSIONATE);

        List<InterestDto> result = passionate.stream()
                .collect(Collectors.toList());
        result.addAll(high);

        ServiceUtils.logMethodExit("findHighIntensityInterests", result.size());
        return result;
    }

    public List<InterestDto> findCasualInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findCasualInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndIntensity(personalId, IntensityLevel.CASUAL);
    }

    public List<InterestDto> findModerateInterests(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findModerateInterests", personalId);
        ServiceUtils.validatePersonalId(personalId);

        return findByPersonalIdAndIntensity(personalId, IntensityLevel.MODERATE);
    }

    // ===== STATISTICS METHODS (folosind metodele exacte) =====

    @Cacheable(value = "interestStats", key = "#personalId")
    public InterestStatisticsDto getInterestStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getInterestStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalInterests = repository.countByPersonalId(personalId);

        // Get category distribution
        List<Object[]> categoryResults = repository.countInterestsByCategory(personalId);
        Map<String, Long> categoryDistribution = categoryResults.stream().collect(Collectors.toMap(
                row -> ((InterestCategory) row[0]).toString().toLowerCase(),
                row -> ((Number) row[1]).longValue()
        ));

        // Get intensity distribution
        List<Object[]> intensityResults = repository.countInterestsByIntensity(personalId);
        Map<String, Long> intensityDistribution = intensityResults.stream().collect(Collectors.toMap(
                row -> ((IntensityLevel) row[0]).toString().toLowerCase(),
                row -> ((Number) row[1]).longValue()
        ));

        // Get counts for different types
        Long featuredCount = (long) findFeaturedInterests(personalId).size();
        Long passionateCount = (long) findPassionateInterests(personalId).size();
        Long highIntensityCount = (long) findHighIntensityInterests(personalId).size();

        InterestStatisticsDto result = InterestStatisticsDto.builder()
                .totalInterests(totalInterests)
                .categoryDistribution(categoryDistribution)
                .intensityDistribution(intensityDistribution)
                .featuredCount(featuredCount)
                .passionateCount(passionateCount)
                .highIntensityCount(highIntensityCount)
                .diversityScore(calculateDiversityScore(categoryDistribution))
                .build();

        ServiceUtils.logMethodExit("getInterestStatistics", result);
        return result;
    }

    // ===== RECENT DISCOVERIES =====

    public List<InterestDto> findInterestsWithRecentDiscoveries(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findInterestsWithRecentDiscoveries", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Interest> interests = repository.findByPersonalIdWithDiscoveries(personalId);
        List<InterestDto> result = interests.stream()
                .filter(interest -> interest.getRecentDiscoveries() != null &&
                        !interest.getRecentDiscoveries().isEmpty())
                .map(this::toInterestDtoWithDiscoveries)
                .toList();

        ServiceUtils.logMethodExit("findInterestsWithRecentDiscoveries", result.size());
        return result;
    }

    // ===== DTO CONVERSION =====

    private InterestDto toInterestDto(Interest interest) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.INTEREST, interest.getId());

        // Basic conversion without discoveries
        String defaultColor = getColorForInterestCategory(interest.getCategory());
        String defaultIcon = getIconForInterestCategory(interest.getCategory());

        return InterestDto.builder()
                .id(interest.getId().toString())
                .name(interest.getDescription()) // Based on DTO structure
                .description(ServiceUtils.truncateText(interest.getDescription(), 300))
                .icon(ServiceUtils.getIconFromMetadata(metadata, defaultIcon))
                .category(ServiceUtils.enumToLowerString(interest.getCategory()))
                .whyInterested(interest.getWhyInterested())
                .recentDiscoveries(List.of()) // Empty for basic conversion
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, defaultColor))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, getLightColorForInterestCategory(interest.getCategory())))
                .build();
    }

    private InterestDto toInterestDtoWithDiscoveries(Interest interest) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.INTEREST, interest.getId());

        // Convert recent discoveries
        List<RecentDiscoveryDto> discoveries = getRecentDiscoveries(interest);

        String defaultColor = getColorForInterestCategory(interest.getCategory());
        String defaultIcon = getIconForInterestCategory(interest.getCategory());

        return InterestDto.builder()
                .id(interest.getId().toString())
                .name(interest.getDescription())
                .description(ServiceUtils.truncateText(interest.getDescription(), 300))
                .icon(ServiceUtils.getIconFromMetadata(metadata, defaultIcon))
                .category(ServiceUtils.enumToLowerString(interest.getCategory()))
                .whyInterested(interest.getWhyInterested())
                .recentDiscoveries(discoveries)
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, defaultColor))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, getLightColorForInterestCategory(interest.getCategory())))
                .build();
    }

    // ===== HELPER METHODS =====

    private List<RecentDiscoveryDto> getRecentDiscoveries(Interest interest) {
        if (interest.getRecentDiscoveries() == null || interest.getRecentDiscoveries().isEmpty()) {
            return List.of();
        }

        return interest.getRecentDiscoveries().stream()
                .map(this::toRecentDiscoveryDto)
                .toList();
    }

    private RecentDiscoveryDto toRecentDiscoveryDto(RecentDiscovery discovery) {
        return RecentDiscoveryDto.builder()
                .id(discovery.getId().toString())
                .title(discovery.getTitle())
                .description(ServiceUtils.truncateText(discovery.getDescription(), 200))
                .discoveryDate(ServiceUtils.formatDateAsIso(discovery.getDiscoveryDate()))
                .source(discovery.getSource())
                .impactLevel(ServiceUtils.enumToLowerString(discovery.getImpactLevel()))
                .build();
    }

    private Double calculateDiversityScore(Map<String, Long> categoryDistribution) {
        if (categoryDistribution.isEmpty()) return 0.0;

        // Simple diversity score: number of categories with interests
        int categoriesWithInterests = categoryDistribution.size();
        int totalPossibleCategories = InterestCategory.values().length;

        return (double) categoriesWithInterests / totalPossibleCategories * 100.0;
    }

    private String getColorForInterestCategory(InterestCategory category) {
        if (category == null) return "#6B7280"; // Gray

        return switch (category) {
            case TECHNOLOGY -> "#3B82F6"; // Blue
            case SCIENCE -> "#10B981"; // Green
            case ARTS -> "#EC4899"; // Pink
            case BUSINESS -> "#F59E0B"; // Amber
            case HEALTH -> "#EF4444"; // Red
            case EDUCATION -> "#8B5CF6"; // Purple
            case ENVIRONMENT -> "#84CC16"; // Lime
            case POLITICS -> "#6366F1"; // Indigo
            case TRAVEL -> "#06B6D4"; // Cyan
            case FOOD -> "#F97316"; // Orange
            case SPORTS -> "#059669"; // Emerald
            case ENTERTAINMENT -> "#D946EF"; // Fuchsia
            case LEARNING -> "#c4c400";
            case CULTURE -> "#2a2980";
        };
    }

    private String getLightColorForInterestCategory(InterestCategory category) {
        if (category == null) return "#F3F4F6"; // Light Gray

        return switch (category) {
            case TECHNOLOGY -> "#DBEAFE"; // Light Blue
            case SCIENCE -> "#D1FAE5"; // Light Green
            case ARTS -> "#FCE7F3"; // Light Pink
            case BUSINESS -> "#FEF3C7"; // Light Amber
            case HEALTH -> "#FEE2E2"; // Light Red
            case EDUCATION -> "#F3E8FF"; // Light Purple
            case ENVIRONMENT -> "#ECFCCB"; // Light Lime
            case POLITICS -> "#E0E7FF"; // Light Indigo
            case TRAVEL -> "#CFFAFE"; // Light Cyan
            case FOOD -> "#FED7AA"; // Light Orange
            case SPORTS -> "#D1FAE5"; // Light Emerald
            case ENTERTAINMENT -> "#FAE8FF"; // Light Fuchsia
            case LEARNING -> "#f6ff47";
            case CULTURE -> "#6bebff";
        };
    }

    private String getIconForInterestCategory(InterestCategory category) {
        if (category == null) return "heart";

        return switch (category) {
            case TECHNOLOGY -> "code";
            case SCIENCE -> "beaker";
            case ARTS -> "palette";
            case BUSINESS -> "briefcase";
            case HEALTH -> "heart-pulse";
            case EDUCATION -> "graduation-cap";
            case ENVIRONMENT -> "leaf";
            case POLITICS -> "users";
            case TRAVEL -> "map-pin";
            case FOOD -> "utensils";
            case SPORTS -> "activity";
            case ENTERTAINMENT -> "play";
            case LEARNING -> "book";
            case CULTURE -> "mask";
        };
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Interest> findFeatured() {
        return repository.findAll().stream()
                .filter(interest -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.INTEREST, interest.getId());
                    return ServiceUtils.isFeatured(metadata);
                })
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.INTEREST, id)
                .isPresent();
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class InterestStatisticsDto {
    private Long totalInterests;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> intensityDistribution;
    private Long featuredCount;
    private Long passionateCount;
    private Long highIntensityCount;
    private Double diversityScore;

    public Double getFeaturedPercentage() {
        if (totalInterests == 0) return 0.0;
        return ServiceUtils.calculatePercentage(featuredCount, totalInterests);
    }

    public Double getPassionatePercentage() {
        if (totalInterests == 0) return 0.0;
        return ServiceUtils.calculatePercentage(passionateCount, totalInterests);
    }

    public String getMostCommonCategory() {
        return ServiceUtils.findMostFrequent(
                categoryDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("unknown");
    }

    public String getDominantIntensity() {
        return ServiceUtils.findMostFrequent(
                intensityDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("medium");
    }

    public Boolean isHighlyEngaged() {
        return passionateCount != null && passionateCount > 0;
    }

    public String getDiversityLevel() {
        if (diversityScore >= 75.0) return "Very High";
        if (diversityScore >= 50.0) return "High";
        if (diversityScore >= 25.0) return "Medium";
        return "Low";
    }
}