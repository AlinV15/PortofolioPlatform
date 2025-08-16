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
 * Technology Service with ServiceUtils
 */
@Service
@Slf4j
public class TechnologyService extends BaseService<Technology, Long, TechnologyRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final EntityTechnologyRepository entityTechnologyRepository;
    private final TechnologyCategoryRepository technologyCategoryRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public TechnologyService(TechnologyRepository technologyRepository,
                             EntityMetadataRepository entityMetadataRepository,
                             EntityTechnologyRepository entityTechnologyRepository,
                             TechnologyCategoryRepository technologyCategoryRepository,
                             ProjectRepository projectRepository) {
        super(technologyRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.entityTechnologyRepository = entityTechnologyRepository;
        this.technologyCategoryRepository = technologyCategoryRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.TECHNOLOGY.name();
    }

    @Override
    protected TechnologyDto toDto(Technology technology) {
        return toTechnologyDto(technology);
    }

    // ===== CORE TECHNOLOGY QUERIES =====

    @Cacheable(value = "allTechnologies")
    public List<TechnologyDto> findAllTechnologies() {
        ServiceUtils.logMethodEntry("findAllTechnologies");

        List<Technology> technologies = repository.findAll();
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findAllTechnologies", result.size());
        return result;
    }

    @Cacheable(value = "technologiesByPersonal", key = "#personalId")
    public List<TechnologyDto> findUsedByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findUsedByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Technology> technologies = repository.findUsedByPersonalId(personalId);
        List<TechnologyDto> result = technologies.stream()
                .map(tech -> toTechnologyDtoForPersonal(tech, personalId))
                .toList();

        ServiceUtils.logMethodExit("findUsedByPersonalId", result.size());
        return result;
    }

    @Cacheable(value = "technologiesByCategory", key = "#personalId + '_' + #categoryId")
    public List<TechnologyDto> findUsedByPersonalIdAndCategory(@Valid @NotNull @Positive Long personalId,
                                                               @Valid @NotNull @Positive Long categoryId) {
        ServiceUtils.logMethodEntry("findUsedByPersonalIdAndCategory", personalId, categoryId);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateEntityId(categoryId);

        List<Technology> technologies = repository.findUsedByPersonalIdAndCategoryId(personalId, categoryId);
        List<TechnologyDto> result = technologies.stream()
                .map(tech -> toTechnologyDtoForPersonal(tech, personalId))
                .toList();

        ServiceUtils.logMethodExit("findUsedByPersonalIdAndCategory", result.size());
        return result;
    }

    @Cacheable(value = "technologiesByCategory", key = "#categoryId")
    public List<TechnologyDto> findByCategory(@Valid @NotNull @Positive Long categoryId) {
        ServiceUtils.logMethodEntry("findByCategory", categoryId);
        ServiceUtils.validateEntityId(categoryId);

        List<Technology> technologies = repository.findByCategoryIdWithCategory(categoryId);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findByCategory", result.size());
        return result;
    }

    // ===== TRENDING & POPULAR TECHNOLOGIES =====

    @Cacheable(value = "trendingTechnologies")
    public List<TechnologyDto> findTrendingTechnologies() {
        ServiceUtils.logMethodEntry("findTrendingTechnologies");

        List<Technology> technologies = repository.findTrendingTechnologies();
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findTrendingTechnologies", result.size());
        return result;
    }

    @Cacheable(value = "trendingTechnologiesByCategory", key = "#categoryId")
    public List<TechnologyDto> findTrendingByCategory(@Valid @NotNull @Positive Long categoryId) {
        ServiceUtils.logMethodEntry("findTrendingByCategory", categoryId);
        ServiceUtils.validateEntityId(categoryId);

        List<Technology> technologies = repository.findTrendingByCategoryId(categoryId);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findTrendingByCategory", result.size());
        return result;
    }

    @Cacheable(value = "popularTechnologies", key = "#minScore")
    public List<TechnologyDto> findPopularTechnologies(@Valid @NotNull Integer minScore) {
        ServiceUtils.logMethodEntry("findPopularTechnologies", minScore);

        if (minScore < 0 || minScore > 100) {
            throw new IllegalArgumentException("Popularity score must be between 0 and 100");
        }

        List<Technology> technologies = repository.findPopularTechnologies(minScore);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findPopularTechnologies", result.size());
        return result;
    }

    // ===== SEARCH & FILTERING =====

    public List<TechnologyDto> searchTechnologies(@Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchTechnologies", searchTerm);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Technology> technologies = repository.findByNameOrDescriptionContaining(searchTerm);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("searchTechnologies", result.size());
        return result;
    }

    public List<TechnologyDto> searchInCategory(@Valid @NotNull @Positive Long categoryId,
                                                @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchInCategory", categoryId, searchTerm);
        ServiceUtils.validateEntityId(categoryId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Technology> technologies = repository.findByCategoryIdAndSearchTerm(categoryId, searchTerm);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("searchInCategory", result.size());
        return result;
    }

    // ===== VERSION MANAGEMENT =====

    public List<TechnologyDto> findVersionsByName(@Valid @NotNull String technologyName) {
        ServiceUtils.logMethodEntry("findVersionsByName", technologyName);

        if (technologyName == null || technologyName.trim().isEmpty()) {
            throw new IllegalArgumentException("Technology name cannot be empty");
        }

        List<Technology> technologies = repository.findVersionsByName(technologyName);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findVersionsByName", result.size());
        return result;
    }

    public List<TechnologyDto> findRecentlyReleased(@Valid @NotNull Integer days) {
        ServiceUtils.logMethodEntry("findRecentlyReleased", days);

        if (days <= 0) {
            throw new IllegalArgumentException("Days must be positive");
        }

        LocalDate since = LocalDate.now().minusDays(days);
        List<Technology> technologies = repository.findRecentlyReleased(since);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findRecentlyReleased", result.size());
        return result;
    }

    // ===== FEATURES =====

    public List<TechnologyDto> findByFeature(@Valid @NotNull String feature) {
        ServiceUtils.logMethodEntry("findByFeature", feature);

        if (feature == null || feature.trim().isEmpty()) {
            throw new IllegalArgumentException("Feature cannot be empty");
        }

        List<Technology> technologies = repository.findByFeatureContaining(feature);
        List<TechnologyDto> result = technologies.stream()
                .map(this::toTechnologyDto)
                .toList();

        ServiceUtils.logMethodExit("findByFeature", result.size());
        return result;
    }

    // ===== STATISTICS =====

    @Cacheable(value = "technologyStatsByCategory")
    public Map<String, Long> getTechnologyStatsByCategory() {
        ServiceUtils.logMethodEntry("getTechnologyStatsByCategory");

        List<Object[]> results = repository.countTechnologiesByCategory();
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getTechnologyStatsByCategory", stats.size());
        return stats;
    }

    @Cacheable(value = "technologyStats")
    public TechnologyStatisticsDto getTechnologyStatistics() {
        ServiceUtils.logMethodEntry("getTechnologyStatistics");

        Long totalTechnologies = count();
        Long trendingCount = repository.countTrendingTechnologies();
        Double avgPopularityScore = repository.findAveragePopularityScore();
        Map<String, Long> categoryStats = getTechnologyStatsByCategory();

        TechnologyStatisticsDto result = TechnologyStatisticsDto.builder()
                .totalTechnologies(totalTechnologies)
                .trendingCount(trendingCount)
                .averagePopularityScore(avgPopularityScore != null ? avgPopularityScore : 0.0)
                .categoryDistribution(categoryStats)
                .recentlyReleasedCount((long) findRecentlyReleased(30).size())
                .build();

        ServiceUtils.logMethodExit("getTechnologyStatistics", result);
        return result;
    }

    @Cacheable(value = "personalTechnologyStats", key = "#personalId")
    public PersonalTechnologyStatsDto getPersonalTechnologyStats(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getPersonalTechnologyStats", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Technology> usedTechnologies = repository.findUsedByPersonalId(personalId);

        Map<String, Long> categoryUsage = usedTechnologies.stream()
                .filter(tech -> tech.getCategory() != null)
                .collect(Collectors.groupingBy(
                        tech -> tech.getCategory().getName(),
                        Collectors.counting()
                ));

        long trendingUsed = usedTechnologies.stream()
                .mapToLong(tech -> tech.getTrending() ? 1 : 0)
                .sum();

        PersonalTechnologyStatsDto result = PersonalTechnologyStatsDto.builder()
                .totalUsed((long) usedTechnologies.size())
                .categoryUsage(categoryUsage)
                .trendingUsed(trendingUsed)
                .mostUsedCategory(ServiceUtils.findMostFrequent(
                        categoryUsage.keySet().stream()
                                .toList()
                ).orElse("Unknown"))
                .expertLevel(calculateExpertLevelCount(personalId))
                .build();

        ServiceUtils.logMethodExit("getPersonalTechnologyStats", result);
        return result;
    }

    // ===== CATEGORY MANAGEMENT =====

    @Cacheable(value = "technologyCategoriesWithCount")
    public List<TechCategoryInfoDto> getCategoriesWithCount() {
        ServiceUtils.logMethodEntry("getCategoriesWithCount");

        List<Object[]> results = technologyCategoryRepository.findAllWithTechnologyCount();
        List<TechCategoryInfoDto> categories = results.stream()
                .map(row -> {
                    TechnologyCategory category = (TechnologyCategory) row[0];
                    Long count = ((Number) row[1]).longValue();

                    return TechCategoryInfoDto.builder()
                            .id(category.getId().toString())
                            .name(category.getName())
                            .description(ServiceUtils.truncateText(category.getDescription(), 200))
                            .icon(category.getIcon() != null ? category.getIcon().getName() : getDefaultIconForCategory(category.getName()))
                            .color(getColorForCategory(category.getName()))
                            .bgColor(getBgColorForCategory(category.getName()))
                            .build();
                })
                .toList();

        ServiceUtils.logMethodExit("getCategoriesWithCount", categories.size());
        return categories;
    }

    // ===== PROJECT USAGE ANALYSIS =====

    public List<TechnologyDto> findMostUsedTechnologies(@Valid @NotNull @Positive Long personalId,
                                                        int limit) {
        ServiceUtils.logMethodEntry("findMostUsedTechnologies", personalId, limit);
        ServiceUtils.validatePersonalId(personalId);

        if (limit <= 0 || limit > 50) {
            throw new IllegalArgumentException("Limit must be between 1 and 50");
        }

        List<Technology> usedTechnologies = repository.findUsedByPersonalId(personalId);

        // Sort by usage count (project count)
        List<TechnologyDto> result = usedTechnologies.stream()
                .map(tech -> toTechnologyDtoForPersonal(tech, personalId))
                .sorted((a, b) -> b.getProjects().compareTo(a.getProjects()))
                .limit(limit)
                .toList();

        ServiceUtils.logMethodExit("findMostUsedTechnologies", result.size());
        return result;
    }

    // ===== DTO CONVERSION =====

    private TechnologyDto toTechnologyDto(Technology technology) {
        return toTechnologyDtoForPersonal(technology, null);
    }

    private TechnologyDto toTechnologyDtoForPersonal(Technology technology, Long personalId) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.TECHNOLOGY, technology.getId());

        // Get usage information
        Integer projectCount = personalId != null ?
                getProjectCountForPersonal(technology.getId(), personalId) :
                entityTechnologyRepository.countByEntityTypeAndTechnologyId(EntityType.PROJECT, technology.getId());

        // Get proficiency and experience for personal usage
        String proficiency = personalId != null ?
                calculateProficiencyForPersonal(technology.getId(), personalId) :
                "beginner";

        Double yearsOfExperience = personalId != null ?
                calculateExperienceForPersonal(technology.getId(), personalId) :
                0.0;

        // Get features
        List<String> features = getTechnologyFeatures(technology);

        return TechnologyDto.builder()
                .id(technology.getId().toString())
                .name(technology.getName())
                .category(technology.getCategory() != null ? technology.getCategory().getName() : "Other")
                .proficiency(proficiency)
                .level(ServiceUtils.proficiencyToLevel(proficiency))
                .yearsOfExperience(yearsOfExperience)
                .projects(projectCount)
                .description(ServiceUtils.truncateText(technology.getDescription(), 300))
                .icon(ServiceUtils.getIconFromMetadata(metadata, getDefaultIconForTechnology(technology.getName())))
                .color(ServiceUtils.getColorFromMetadata(metadata, getColorForTechnology(technology)))
                .backgroundColor(ServiceUtils.getColorFromMetadata(metadata, getBgColorForTechnology(technology)))
                .features(features)
                .trending(technology.getTrending())
                .certification(hasCertification(technology.getId(), personalId))
                .learning(isCurrentlyLearning(technology.getId(), personalId))
                .build();
    }

    // ===== HELPER METHODS =====

    private List<String> getTechnologyFeatures(Technology technology) {
        if (technology.getFeatures() == null || technology.getFeatures().isEmpty()) {
            return List.of();
        }
        return technology.getFeatures().stream()
                .filter(feature -> !feature.getDeprecated())
                .map(TechnologyFeature::getTitle)
                .filter(Objects::nonNull)
                .toList();
    }

    private Integer getProjectCountForPersonal(Long technologyId, Long personalId) {
        if (personalId == null) return 0;

        // Get all projects for personal that use this technology
        List<EntityTechnology> entityTechs = entityTechnologyRepository
                .findByEntityTypeAndEntityIdWithTechnology(EntityType.PROJECT, technologyId);

        return (int) entityTechs.stream()
                .filter(et -> {
                    // Check if the project belongs to the personal
                    Optional<Project> project = projectRepository.findById(et.getEntityId());
                    return project.isPresent() && project.get().getPersonal().getId().equals(personalId);
                })
                .count();
    }

    private String calculateProficiencyForPersonal(Long technologyId, Long personalId) {
        if (personalId == null) return "beginner";

        Integer projectCount = getProjectCountForPersonal(technologyId, personalId);

        if (projectCount >= 5) return "expert";
        if (projectCount >= 3) return "advanced";
        if (projectCount >= 1) return "intermediate";
        return "beginner";
    }

    private Double calculateExperienceForPersonal(Long technologyId, Long personalId) {
        if (personalId == null) return 0.0;

        // Simplified calculation - could be enhanced with actual project dates
        Integer projectCount = getProjectCountForPersonal(technologyId, personalId);
        return Math.min(projectCount * 0.5, 5.0); // Max 5 years experience
    }


    private Boolean hasCertification(Long technologyId, Long personalId) {
        // TODO: Implement certificate checking for technology
        return false;
    }

    private Boolean isCurrentlyLearning(Long technologyId, Long personalId) {
        // TODO: Implement learning progress checking
        return false;
    }

    private Long calculateExpertLevelCount(Long personalId) {
        List<Technology> usedTechnologies = repository.findUsedByPersonalId(personalId);
        return usedTechnologies.stream()
                .mapToLong(tech -> {
                    String proficiency = calculateProficiencyForPersonal(tech.getId(), personalId);
                    return "expert".equals(proficiency) || "advanced".equals(proficiency) ? 1 : 0;
                })
                .sum();
    }

    // ===== COLOR & ICON HELPERS =====

    private String getColorForTechnology(Technology technology) {
        if (technology.getTrending()) return "#8B5CF6"; // Purple for trending
        if (technology.getPopularityScore() != null && technology.getPopularityScore() >= 80) {
            return "#10B981"; // Green for popular
        }
        return "#6B7280"; // Gray default
    }

    private String getBgColorForTechnology(Technology technology) {
        if (technology.getTrending()) return "#F3E8FF"; // Light Purple
        if (technology.getPopularityScore() != null && technology.getPopularityScore() >= 80) {
            return "#D1FAE5"; // Light Green
        }
        return "#F9FAFB"; // Light Gray
    }

    private String getColorForCategory(String categoryName) {
        return switch (categoryName.toLowerCase()) {
            case "frontend", "ui/ux" -> "#3B82F6"; // Blue
            case "backend", "server" -> "#10B981"; // Green
            case "database" -> "#F59E0B"; // Amber
            case "cloud", "devops" -> "#8B5CF6"; // Purple
            case "mobile" -> "#EF4444"; // Red
            case "ai/ml", "data science" -> "#06B6D4"; // Cyan
            default -> "#6B7280"; // Gray
        };
    }

    private String getBgColorForCategory(String categoryName) {
        return switch (categoryName.toLowerCase()) {
            case "frontend", "ui/ux" -> "#DBEAFE"; // Light Blue
            case "backend", "server" -> "#D1FAE5"; // Light Green
            case "database" -> "#FEF3C7"; // Light Amber
            case "cloud", "devops" -> "#F3E8FF"; // Light Purple
            case "mobile" -> "#FEE2E2"; // Light Red
            case "ai/ml", "data science" -> "#CFFAFE"; // Light Cyan
            default -> "#F9FAFB"; // Light Gray
        };
    }

    private String getDefaultIconForTechnology(String technologyName) {
        if (technologyName == null) return "code";

        String lowerName = technologyName.toLowerCase();
        if (lowerName.contains("react") || lowerName.contains("vue") || lowerName.contains("angular")) {
            return "component";
        }
        if (lowerName.contains("java") || lowerName.contains("python") || lowerName.contains("javascript")) {
            return "code";
        }
        if (lowerName.contains("database") || lowerName.contains("sql") || lowerName.contains("mongo")) {
            return "database";
        }
        if (lowerName.contains("cloud") || lowerName.contains("aws") || lowerName.contains("azure")) {
            return "cloud";
        }
        return "code";
    }

    private String getDefaultIconForCategory(String categoryName) {
        return switch (categoryName.toLowerCase()) {
            case "frontend" -> "layout";
            case "backend" -> "server";
            case "database" -> "database";
            case "cloud" -> "cloud";
            case "mobile" -> "smartphone";
            case "ai/ml" -> "brain";
            default -> "code";
        };
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Technology> findFeatured() {
        return repository.findTrendingTechnologies(); // Use trending as featured
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.TECHNOLOGY, id)
                .isPresent();
    }
}


