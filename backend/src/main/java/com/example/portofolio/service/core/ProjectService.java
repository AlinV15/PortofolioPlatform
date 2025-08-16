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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
 * Optimized Project Service with ServiceUtils
 */
@Service
@Slf4j
public class ProjectService extends BaseService<Project, Long, ProjectRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final EntityTechnologyRepository entityTechnologyRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository,
                          EntityMetadataRepository entityMetadataRepository,
                          EntityTechnologyRepository entityTechnologyRepository) {
        super(projectRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.entityTechnologyRepository = entityTechnologyRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.PROJECT.name();
    }

    @Override
    protected ProjectExportDto toDto(Project project) {
        return toProjectExportDto(project);
    }


    // ===== LIVE PROJECTS =====

    @Cacheable(value = "liveProjects", key = "#personalId")
    public List<FeaturedProjectDto> findLiveProjects(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findLiveProjects", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalId(personalId);

        // Filtrează doar proiectele care au demoUrl (link live) și nu este null/empty
        List<Project> liveProjects = projects.stream()
                .filter(project -> project.getDemoUrl() != null &&
                        !project.getDemoUrl().trim().isEmpty())
                .toList();

        List<FeaturedProjectDto> result = ServiceUtils.safeMap(liveProjects, this::toFeaturedProjectDto);

        log.debug("Found {} live projects out of {} total projects for personalId: {}",
                result.size(), projects.size(), personalId);

        ServiceUtils.logMethodExit("findLiveProjects", result.size());
        return result;
    }
    // ===== CORE PROJECT QUERIES =====

    @Cacheable(value = "projectsByPersonal", key = "#personalId")
    public List<ProjectExportDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalId(personalId);
        List<ProjectExportDto> result = ServiceUtils.safeMap(projects, this::toProjectExportDto);

        ServiceUtils.logMethodExit("findByPersonalId", result.size());
        return result;
    }

    @Cacheable(value = "featuredProjects", key = "#personalId")
    public List<FeaturedProjectDto> findFeaturedProjects(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findFeaturedProjects", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> allProjects = repository.findByPersonalId(personalId);
        List<Project> featuredProjects = ServiceUtils.filterAndMap(
                allProjects,
                project -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId());
                    return ServiceUtils.isFeatured(metadata);
                },
                java.util.function.Function.identity()
        );

        List<FeaturedProjectDto> result = ServiceUtils.safeMap(featuredProjects, this::toFeaturedProjectDto);
        ServiceUtils.logMethodExit("findFeaturedProjects", result.size());
        return result;
    }

    public List<ProjectExportDto> findByStatus(@Valid @NotNull @Positive Long personalId,
                                               @Valid @NotNull ProjectStatus status) {
        ServiceUtils.logMethodEntry("findByStatus", personalId, status);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalIdAndStatus(personalId, status);
        List<ProjectExportDto> result = ServiceUtils.safeMap(projects, this::toProjectExportDto);

        ServiceUtils.logMethodExit("findByStatus", result.size());
        return result;
    }

    public List<ProjectExportDto> findByCategory(@Valid @NotNull @Positive Long personalId,
                                                 @Valid @NotNull String category) {
        ServiceUtils.logMethodEntry("findByCategory", personalId, category);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalIdAndCategory(personalId, category);
        List<ProjectExportDto> result = ServiceUtils.safeMap(projects, this::toProjectExportDto);

        ServiceUtils.logMethodExit("findByCategory", result.size());
        return result;
    }

    public List<ProjectExportDto> findByYear(@Valid @NotNull @Positive Long personalId,
                                             @Valid @NotNull Integer year) {
        ServiceUtils.logMethodEntry("findByYear", personalId, year);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalIdAndYear(personalId, year);
        List<ProjectExportDto> result = ServiceUtils.safeMap(projects, this::toProjectExportDto);

        ServiceUtils.logMethodExit("findByYear", result.size());
        return result;
    }

    // ===== SEARCH & FILTERING =====

    public List<ProjectExportDto> searchProjects(@Valid @NotNull @Positive Long personalId,
                                                 @Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchProjects", personalId, searchTerm);
        ServiceUtils.validatePersonalId(personalId);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<Project> projects = repository.findByPersonalIdAndSearchTerm(personalId, searchTerm);
        List<ProjectExportDto> result = ServiceUtils.safeMap(projects, this::toProjectExportDto);

        ServiceUtils.logMethodExit("searchProjects", result.size());
        return result;
    }

    public Page<FeaturedProjectDto> findRecentProjects(@Valid @NotNull @Positive Long personalId,
                                                       int page, int size) {
        ServiceUtils.logMethodEntry("findRecentProjects", personalId, page, size);
        ServiceUtils.validatePersonalId(personalId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Project> projects = repository.findByPersonalIdOrderByCompletionDateDesc(personalId, pageable);
        Page<FeaturedProjectDto> result = projects.map(this::toFeaturedProjectDto);

        ServiceUtils.logMethodExit("findRecentProjects", result.getContent().size());
        return result;
    }

    // ===== STATISTICS =====

    @Cacheable(value = "projectStatsByCategory", key = "#personalId")
    public Map<String, Long> getProjectStatsByCategory(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getProjectStatsByCategory", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Object[]> results = repository.countProjectsByCategory(personalId);
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getProjectStatsByCategory", stats.size());
        return stats;
    }

    @Cacheable(value = "projectStats", key = "#personalId")
    public ProjectStatisticsDto getProjectStatistics(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getProjectStatistics", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Long totalProjects = repository.countByPersonalId(personalId);
        Map<String, Long> categoryStats = getProjectStatsByCategory(personalId);

        Map<String, Long> statusStats = Map.of(
                "planning", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.PLANNING),
                "development", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.DEVELOPMENT),
                "testing", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.TESTING),
                "production", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.PRODUCTION),
                "maintenance", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.MAINTENANCE),
                "archived", repository.countByPersonalIdAndStatus(personalId, ProjectStatus.ARCHIVED)
        );

        ProjectStatisticsDto result = ProjectStatisticsDto.builder()
                .totalProjects(totalProjects)
                .categoryDistribution(categoryStats)
                .statusDistribution(statusStats)
                .featuredCount((long) findFeaturedProjects(personalId).size())
                .currentYear(findByYear(personalId, LocalDate.now().getYear()).size())
                .build();

        ServiceUtils.logMethodExit("getProjectStatistics", result);
        return result;
    }

    public List<Integer> getAvailableYears(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getAvailableYears", personalId);
        ServiceUtils.validatePersonalId(personalId);

        List<Project> projects = repository.findByPersonalId(personalId);
        List<Integer> years = projects.stream()
                .map(Project::getYear)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .toList();

        ServiceUtils.logMethodExit("getAvailableYears", years.size());
        return years;
    }

    // ===== DTO CONVERSION WITH SERVICEUTILS =====

    private ProjectExportDto toProjectExportDto(Project project) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId());

        List<String> technologies = ServiceUtils.safeMap(
                entityTechnologyRepository.findByEntityTypeAndEntityIdWithTechnology(EntityType.PROJECT, project.getId()),
                et -> et.getTechnology().getName()
        );

        return ProjectExportDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .longDescription(project.getDescription()) // Use same for now
                .technologies(technologies)
                .category(project.getCategory())
                .status(ServiceUtils.enumToLowerString(project.getStatus()))
                .featured(ServiceUtils.isFeatured(metadata))
                .images(getProjectImages(project))
                .demoUrl(project.getDemoUrl())
                .githubUrl(project.getGithubUrl())
                .features(getProjectFeatures(project))
                .challenges(getProjectChallenges(project))
                .developmentTime(project.getDevelopmentTime())
                .complexity(ServiceUtils.enumToLowerString(project.getComplexity()))
                .metrics(project.getMetrics() != null ? toProjectMetricsDto(project.getMetrics()) : null)
                .tags(ServiceUtils.processTags(project.getTags().toString()))
                .year(project.getYear())
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, "#3B82F6"))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, "#93C5FD"))
                .build();
    }

    private FeaturedProjectDto toFeaturedProjectDto(Project project) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId());

        List<String> technologies = ServiceUtils.safeMap(
                entityTechnologyRepository.findByEntityTypeAndEntityIdWithTechnology(EntityType.PROJECT, project.getId()),
                et -> et.getTechnology().getName()
        );

        return FeaturedProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .shortDescription(ServiceUtils.generateShortDescription(project.getDescription(), 150))
                .technologies(technologies)
                .image(getPrimaryImage(project))
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getDemoUrl())
                .featured(ServiceUtils.isFeatured(metadata))
                .category(project.getCategory())
                .primaryColor(ServiceUtils.getColorFromMetadata(metadata, "#3B82F6"))
                .secondaryColor(ServiceUtils.getColorFromMetadata(metadata, "#93C5FD"))
                .build();
    }

    private ProjectMetricsDto toProjectMetricsDto(ProjectMetrics metrics) {
        return ProjectMetricsDto.builder()
                .users(metrics.getUsersCount() != null ? metrics.getUsersCount() : 0L)
                .performance(metrics.getPerformanceScore())
                .codeQuality(metrics.getCodeQualityScore())
                .lines(metrics.getLinesOfCode() != null ? metrics.getLinesOfCode() : 0L)
                .commits(metrics.getCommitsCount())
                .testCoverage(metrics.getTestCoveragePercentage())
                .lastUpdated(ServiceUtils.formatDateAsIso(LocalDate.from(metrics.getLastUpdated())))
                .build();
    }

    // ===== HELPER METHODS =====

    private List<String> getProjectImages(Project project) {
        if (project.getImages() == null || project.getImages().isEmpty()) {
            return List.of();
        }
        return project.getImages().stream()
                .map(ProjectImage::getImageUrl)
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    private String getPrimaryImage(Project project) {
        if (project.getImages() == null || project.getImages().isEmpty()) {
            return null;
        }
        return project.getImages().stream()
                .filter(img -> img.getPrimary() != null && img.getPrimary())
                .findFirst()
                .map(ProjectImage::getImageUrl)
                .orElse(project.getImages().iterator().next().getImageUrl());
    }

    private List<String> getProjectFeatures(Project project) {
        if (project.getFeatures() == null || project.getFeatures().isEmpty()) {
            return List.of();
        }
        return project.getFeatures().stream()
                .map(ProjectFeature::getTitle)
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    private List<String> getProjectChallenges(Project project) {
        if (project.getChallenges() == null || project.getChallenges().isEmpty()) {
            return List.of();
        }
        return project.getChallenges().stream()
                .map(ProjectChallenge::getDescription)
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<Project> findFeatured() {
        return repository.findAll().stream()
                .filter(project -> {
                    Optional<EntityMetadata> metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId());
                    return ServiceUtils.isFeatured(metadata);
                })
                .toList();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, id)
                .isPresent();
    }

    /**
     * Returnează distribuția categoriilor de proiecte cu procentaje
     * Exact ca în imaginea ta - fiecare categorie cu numărul și procentajul
     */
    @Cacheable(value = "projectCategoryDistribution", key = "#personalId")
    public List<ProjectCategoryDistributionDto> getProjectCategoryDistribution(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getProjectCategoryDistribution", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // Obține distribuția din repository
        List<Object[]> distribution = repository.findProjectCategoryDistribution(personalId);
        Long totalProjects = repository.getTotalProjectCount(personalId);

        log.debug("Found {} categories with {} total projects for personalId: {}",
                distribution.size(), totalProjects, personalId);

        // Convertește la DTO cu calculul procentajelor
        List<ProjectCategoryDistributionDto> result = distribution.stream()
                .map(row -> {
                    String category = (String) row[0];
                    Long count = ((Number) row[1]).longValue();

                    // Calculează procentajul
                    Double percentage = totalProjects > 0 ?
                            (count.doubleValue() / totalProjects.doubleValue()) * 100.0 : 0.0;

                    return ProjectCategoryDistributionDto.builder()
                            .category(category)
                            .projectCount(count)
                            .percentage(percentage)
                            .build();
                })
                .toList();

        ServiceUtils.logMethodExit("getProjectCategoryDistribution", result.size());
        return result;
    }


    /**
     * Calculează experiența de development bazată pe proiecte
     * Exact ca în imaginea ta - Years Active, Avg. Complexity, Success Rate
     */
    @Cacheable(value = "developmentExperience", key = "#personalId")
    public DevelopmentExperienceDto getDevelopmentExperience(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getDevelopmentExperience", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // 1. ===== CALCULEAZĂ Years Active =====
        Integer firstYear = repository.findOldestProjectYear(personalId);
        Integer latestYear = repository.findNewestProjectYear(personalId);
        Integer currentYear = LocalDate.now().getYear();

        Integer yearsActive = 0;
        if (firstYear != null) {
            // Calculează diferența până la anul curent sau ultimul proiect
            Integer endYear = latestYear != null ? Math.max(latestYear, currentYear) : currentYear;
            yearsActive = endYear - firstYear + 1; // +1 pentru că primul an se numără
        }

        log.debug("Years calculation: first={}, latest={}, active={}", firstYear, latestYear, yearsActive);

        // 2. ===== CALCULEAZĂ Average Complexity =====
        List<Object[]> complexityDistribution = repository.findComplexityDistribution(personalId);
        String avgComplexity = "INTERMEDIATE"; // default

        if (!complexityDistribution.isEmpty()) {
            // Ia cea mai frecventă complexitate (prima din lista sortată DESC)
            Object[] mostFrequent = complexityDistribution.get(0);
            ComplexityLevel complexityEnum = (ComplexityLevel) mostFrequent[0];
            avgComplexity = complexityEnum.name();

            log.debug("Complexity distribution: {}, most frequent: {}",
                    complexityDistribution.size(), avgComplexity);
        }

        // 3. ===== CALCULEAZĂ Success Rate =====
        Long totalProjects = repository.countByPersonalId(personalId);
        Long deployedProjects = repository.countDeployedProjects(personalId);
        Long liveProjects = repository.countLiveProjects(personalId);

        // Success Rate = (proiecte deployed + live) / total
        // Evităm dublarea dacă un proiect e și deployed și live
        Long completedProjects = repository.countCompletedProjects(personalId);

        Double successRate = 0.0;
        if (totalProjects > 0) {
            // Folosim proiectele deployed ca bază pentru success rate
            successRate = (deployedProjects.doubleValue() / totalProjects.doubleValue()) * 100.0;
        }

        log.debug("Success rate calculation: deployed={}, live={}, total={}, rate={}%",
                deployedProjects, liveProjects, totalProjects, successRate);

        // 4. ===== CONSTRUIEȘTE DTO-ul =====
        DevelopmentExperienceDto result = DevelopmentExperienceDto.builder()
                .yearsActive(yearsActive)
                .firstProjectYear(firstYear)
                .latestProjectYear(latestYear)
                .avgComplexity(avgComplexity)
                .successRate(successRate)
                .deployedProjects(deployedProjects)
                .totalProjects(totalProjects)
                .liveProjects(liveProjects)
                .build();

        ServiceUtils.logMethodExit("getDevelopmentExperience", result);
        return result;
    }

    /**
     * Metodă helper pentru calculul experienței pe domenii/tehnologii specifice
     */
    @Cacheable(value = "technologyExperience", key = "#personalId + '_' + #technologyId")
    public DevelopmentExperienceDto getTechnologyExperience(@Valid @NotNull @Positive Long personalId,
                                                            @Valid @NotNull @Positive Long technologyId) {
        ServiceUtils.logMethodEntry("getTechnologyExperience", personalId, technologyId);
        ServiceUtils.validatePersonalId(personalId);

        // Găsește proiectele care folosesc această tehnologie
        List<Project> techProjects = repository.findByPersonalIdAndTechnologyId(personalId, technologyId);

        if (techProjects.isEmpty()) {
            return DevelopmentExperienceDto.builder()
                    .yearsActive(0)
                    .avgComplexity("BEGINNER")
                    .successRate(0.0)
                    .totalProjects(0L)
                    .deployedProjects(0L)
                    .liveProjects(0L)
                    .build();
        }

        // Calculează experiența doar pentru proiectele cu această tehnologie
        Integer firstYear = techProjects.stream()
                .map(Project::getYear)
                .filter(Objects::nonNull)
                .min(Integer::compareTo)
                .orElse(LocalDate.now().getYear());

        Integer latestYear = techProjects.stream()
                .map(Project::getYear)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(LocalDate.now().getYear());

        Integer yearsActive = latestYear - firstYear + 1;

        // Cea mai frecventă complexitate în proiectele cu această tehnologie
        Map<ComplexityLevel, Long> complexityCount = techProjects.stream()
                .filter(p -> p.getComplexity() != null)
                .collect(Collectors.groupingBy(Project::getComplexity, Collectors.counting()));

        String avgComplexity = complexityCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> entry.getKey().name())
                .orElse("INTERMEDIATE");

        // Success rate pentru această tehnologie
        long deployedCount = techProjects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.PRODUCTION ||
                        p.getStatus() == ProjectStatus.MAINTENANCE)
                .count();

        long liveCount = techProjects.stream()
                .filter(p -> p.getDemoUrl() != null && !p.getDemoUrl().trim().isEmpty())
                .count();

        Double successRate = (deployedCount * 100.0) / techProjects.size();

        DevelopmentExperienceDto result = DevelopmentExperienceDto.builder()
                .yearsActive(yearsActive)
                .firstProjectYear(firstYear)
                .latestProjectYear(latestYear)
                .avgComplexity(avgComplexity)
                .successRate(successRate)
                .deployedProjects(deployedCount)
                .totalProjects((long) techProjects.size())
                .liveProjects(liveCount)
                .build();

        ServiceUtils.logMethodExit("getTechnologyExperience", result);
        return result;
    }

}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class ProjectStatisticsDto {
    private Long totalProjects;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> statusDistribution;
    private Long featuredCount;
    private Integer currentYear;

    public Double getFeaturedPercentage() {
        if (totalProjects == 0) return 0.0;
        return ServiceUtils.calculatePercentage(featuredCount, totalProjects);
    }

    public String getMostActiveCategory() {
        return ServiceUtils.findMostFrequent(
                categoryDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("Unknown");
    }
}