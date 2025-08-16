package com.example.portofolio.service.core;

// ✅ CORECT pentru Spring Boot 3.x:
import com.example.portofolio.entity.Education;
import com.example.portofolio.entity.SkillCategory;
import com.example.portofolio.entity.enums.EducationStatus;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.ServiceUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// Exemplu de utilizare corectă în SkillService:


import com.example.portofolio.dto.*;
import com.example.portofolio.entity.EntityMetadata;
import com.example.portofolio.entity.Skill;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.ProficiencyLevel;
import com.example.portofolio.service.base.BaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@Slf4j
public class SkillService extends BaseService<Skill, Long, SkillRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final EntitySkillRepository entitySkillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;   // 🆕 ADĂUGAT
    private final EntityTechnologyRepository entityTechnologyRepository; // 🆕 ADĂUGAT
    private final EducationRepository educationRepository;       // 🆕 ADĂUGAT

    @Autowired
    public SkillService(SkillRepository skillRepository,
                        EntityMetadataRepository entityMetadataRepository,
                        EntitySkillRepository entitySkillRepository,
                        SkillCategoryRepository skillCategoryRepository,
                        ProjectRepository projectRepository,           // 🆕 ADĂUGAT
                        CertificateRepository certificateRepository,   // 🆕 ADĂUGAT
                        EntityTechnologyRepository entityTechnologyRepository, // 🆕 ADĂUGAT
                        EducationRepository educationRepository) {     // 🆕 ADĂUGAT
        super(skillRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.entitySkillRepository = entitySkillRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.projectRepository = projectRepository;
        this.certificateRepository = certificateRepository;
        this.entityTechnologyRepository = entityTechnologyRepository;
        this.educationRepository = educationRepository;
    }
    @Override
    protected String getEntityTypeName() {
        return EntityType.SKILL.name();
    }

    // ✅ ACUM FUNCȚIONEAZĂ CU JAKARTA:
    @Cacheable(value = "skills", key = "#personalId")
    public List<SkillDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        log.debug("Finding skills for personal ID: {}", personalId);

        // Validare simplă
        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }

        List<Skill> skills = repository.findByPersonalIdWithCategoryAndTags(personalId);
        return skills.stream().map(this::toSkillDto).toList();
    }

    @Cacheable(value = "skillsByCategory", key = "#personalId + '_' + #categoryId")
    public List<SkillDto> findByPersonalIdAndCategory(@Valid @NotNull @Positive Long personalId,
                                                      @Valid @NotNull @Positive Long categoryId) {
        log.debug("Finding skills for personal ID: {} and category: {}", personalId, categoryId);

        // Validări simple
        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }
        if (categoryId == null || categoryId <= 0) {
            throw new IllegalArgumentException("Category ID must be positive");
        }

        List<Skill> skills = repository.findByPersonalIdAndCategoryIdWithCategory(personalId, categoryId);
        return skills.stream().map(this::toSkillDto).toList();
    }

    // ===== DTO CONVERSION =====

    @Override
    protected SkillDto toDto(Skill skill) {
        return toSkillDto(skill);
    }

    /**
     * Preluarea tuturor categoriilor de skill-uri (fără skill-uri)
     */
    @Cacheable(value = "allSkillCategories")
    public List<FeaturedSkillCategoryDto> getAllSkillCategories() {
        log.debug("Getting all skill categories");

        // Folosește metoda optimizată din repository
        List<SkillCategory> allCategories = skillCategoryRepository.findAllWithParentAndIcon();

        // Transformă în DTO fără skill-uri
        return allCategories.stream()
                .map(category -> FeaturedSkillCategoryDto.builder()
                        .name(category.getName())
                        .description(category.getDescription())
                        .icon(category.getIcon() != null ?
                                category.getIcon().getName() :
                                getDefaultCategoryIcon(category.getName()))
                        .skills(null) // Fără skill-uri, le modelezi pe frontend
                        .build())
                .toList();
    }

    private String getDefaultCategoryIcon(String categoryName) {
        if (categoryName == null) return "star";

        return switch (categoryName.toLowerCase()) {
            case "technical skills" -> "code";
            case "communication" -> "users";
            case "management" -> "briefcase";
            case "problem solving" -> "puzzle-piece";
            case "personal development" -> "trending-up";
            case "leadership" -> "crown";
            default -> "star";
        };
    }

    private SkillDto toSkillDto(Skill skill) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId());

        Integer projectCount = entitySkillRepository
                .countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId());

        return SkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .proficiency(skill.getProficiency() != null ?
                        skill.getProficiency().toString().toLowerCase() : null)
                .description(skill.getDescription())
                .yearsOfExperience(skill.getYearsOfExperience() != null ?
                        skill.getYearsOfExperience().doubleValue() : null)
                .projects(projectCount)
                .icon(metadata.map(em -> em.getIcon() != null ? em.getIcon().getName() : null).orElse(null))
                .color(metadata.map(EntityMetadata::getPrimaryColor).orElse(null))
                .category(skill.getCategory() != null ? skill.getCategory().getName() : null)
                .build();
    }

    // ===== FEATURED SKILLS =====

    @Cacheable(value = "featuredSkills", key = "#personalId")
    public List<FeaturedSkillDto> findFeaturedSkills(@Valid @NotNull @Positive Long personalId) {
        log.debug("Finding featured skills for personal ID: {}", personalId);

        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }

        List<Skill> skills = repository.findFeaturedByPersonalId(personalId);
        return skills.stream().map(this::toFeaturedSkillDto).toList();
    }

    private FeaturedSkillDto toFeaturedSkillDto(Skill skill) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId());

        List<String> projectTitles = entitySkillRepository
                .findProjectNamesBySkillId(skill.getId());

        return FeaturedSkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .categoryName(skill.getCategory() != null ? skill.getCategory().getName() : null)
                .icon(metadata.map(em -> em.getIcon() != null ? em.getIcon().getName() : null).orElse(null))
                .description(skill.getDescription())
                .yearsOfExperience(skill.getYearsOfExperience() != null ?
                        skill.getYearsOfExperience().doubleValue() : null)
                .color(metadata.map(EntityMetadata::getPrimaryColor).orElse(null))
                .projects(projectTitles)
                .proficiency(skill.getProficiency() != null ?
                        skill.getProficiency().toString().toLowerCase() : null)
                .trending(skill.getTrending())
                .learning(skill.getLearning())
                .build();
    }

    // ===== SEARCH =====

    public List<SkillDto> searchSkills(@Valid @NotNull @Positive Long personalId,
                                       @Valid @NotNull String searchTerm) {
        log.debug("Searching skills for personal ID: {} with term: {}", personalId, searchTerm);

        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be empty");
        }

        List<Skill> skills = repository.findByPersonalIdAndNameOrDescriptionContaining(personalId, searchTerm);
        return skills.stream().map(this::toSkillDto).toList();
    }

    // ===== STATISTICS =====

    // Înlocuiește metoda getSkillStatistics din SkillService cu aceasta:

    @Cacheable(value = "heroStats", key = "#personalId")
    public SkillsHeroStatsDto getHeroStats(@Valid @NotNull @Positive Long personalId) {
        log.debug("Getting hero statistics for personal ID: {}", personalId);

        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }

        // 1. ===== CALCULEAZĂ ANII DE PROGRAMARE =====
        Integer yearsCoding = calculateYearsCoding(personalId);

        // 2. ===== NUMĂRUL DE PROIECTE =====
        Long totalProjects = projectRepository.countByPersonalId(personalId);

        // 3. ===== NUMĂRUL DE CERTIFICATE =====
        Long totalCertifications = certificateRepository.countByPersonalId(personalId);

        // 4. ===== PROFICIENȚA MEDIE =====
        Double avgLevel = repository.findAverageSkillLevelByPersonalId(personalId);
        Double avgProficiencyPercent = avgLevel != null ? avgLevel : 0.0;

        // 5. ===== NUMĂRUL DE TEHNOLOGII =====
        Integer totalTechnologies = entityTechnologyRepository.countDistinctTechnologiesByPersonalId(personalId);

        // 6. ===== CONSTRUIEȘTE TEXTELE =====
        String yearsCodingText = yearsCoding + "+";
        String projectsText = totalProjects + "+";
        String certificationsText = totalCertifications.toString();
        String avgProficiencyText = Math.round(avgProficiencyPercent) + "%";

        // Text principal
        String description = buildHeroDescription(personalId);
        String projectsBuiltText = totalProjects + "+ projects built";
        String technologiesMasteredText = totalTechnologies + " technologies mastered";

        return SkillsHeroStatsDto.builder()
                .description(description)
                .projectsText(projectsBuiltText)
                .technologiesText(technologiesMasteredText)
                .yearsCoding(yearsCodingText)
                .projects(totalProjects.toString())
                .certifications(certificationsText)
                .avgProficiency(avgProficiencyText)
                .yearsCodingLabel("YEARS CODING")
                .projectsLabel("PROJECTS")
                .certificationsLabel("CERTIFICATIONS")
                .avgProficiencyLabel("AVG. PROFICIENCY")
                .build();
    }

    /**
     * Calculează anii de programare bazat pe primul proiect sau skill
     */
    private Integer calculateYearsCoding(Long personalId) {
        // 1. Încearcă din primul proiect
        Integer oldestProjectYear = projectRepository.findOldestProjectYear(personalId);

        // 2. Încearcă din primul skill (dacă ai createdAt în skills)
        LocalDate oldestSkillDate = repository.findOldestSkillDate(personalId);

        // 3. Calculează anii
        int currentYear = LocalDate.now().getYear();
        Integer yearsFromProjects = oldestProjectYear != null ? currentYear - oldestProjectYear : 0;
        Integer yearsFromSkills = oldestSkillDate != null ? currentYear - oldestSkillDate.getYear() : 0;

        // Ia maximul dintre cele două
        Integer yearsCoding = Math.max(yearsFromProjects, yearsFromSkills);

        // Minim 1 an dacă are skill-uri sau proiecte
        return Math.max(yearsCoding, 1);
    }

    /**
     * Construiește descrierea principală pentru hero section
     */
    private String buildHeroDescription(Long personalId) {
        // Încearcă să obții specialization din educația curentă
        List<Education> ongoingEducations = educationRepository.findByPersonalIdAndStatus(personalId, EducationStatus.ONGOING);
        Optional<Education> currentEducation = ongoingEducations.stream().findFirst();

        String specialization = "Computer Science Economics"; // Default
        if (currentEducation.isPresent() && currentEducation.get().getFieldOfStudy() != null) {
            specialization = currentEducation.get().getFieldOfStudy();
        }

        return specialization + " student with expertise in modern web technologies";
    }

// ===== PĂSTREAZĂ ȘI METODA ORIGINALĂ PENTRU COMPATIBILITATE =====

    @Cacheable(value = "skillStats", key = "#personalId")
    public SkillStatisticsDto getSkillStatistics(@Valid @NotNull @Positive Long personalId) {
        log.debug("Getting skill statistics for personal ID: {}", personalId);

        if (personalId == null || personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }

        Long totalSkills = repository.countByPersonalId(personalId);
        Double avgLevel = repository.findAverageSkillLevelByPersonalId(personalId);

        Map<String, Long> proficiencyDistribution = Map.of(
                "beginner", repository.countByPersonalIdAndProficiency(personalId, ProficiencyLevel.BEGINNER),
                "intermediate", repository.countByPersonalIdAndProficiency(personalId, ProficiencyLevel.INTERMEDIATE),
                "advanced", repository.countByPersonalIdAndProficiency(personalId, ProficiencyLevel.ADVANCED),
                "expert", repository.countByPersonalIdAndProficiency(personalId, ProficiencyLevel.EXPERT)
        );

        return SkillStatisticsDto.builder()
                .totalSkills(totalSkills)
                .averageLevel(avgLevel != null ? avgLevel : 0.0)
                .proficiencyDistribution(proficiencyDistribution)
                .featuredCount((long) findFeaturedSkills(personalId).size())
                .trendingCount(repository.countByPersonalIdAndTrending(personalId, true))
                .learningCount(repository.countByPersonalIdAndLearning(personalId, true))
                .build();
    }

    /**
     * Returnează top 5 skills bazate pe level
     * Respectă interfața TopSkill: {name, level, color}
     */
    @Cacheable(value = "topSkills", key = "#personalId + '_' + #limit")
    public List<TopSkillDto> getTopSkills(@Valid @NotNull @Positive Long personalId,
                                          @Valid @Positive Integer limit) {
        ServiceUtils.logMethodEntry("getTopSkills", personalId, limit);
        ServiceUtils.validatePersonalId(personalId);

        // Default la 5 dacă nu se specifică limit
        int skillLimit = limit != null ? limit : 5;
        Pageable pageable = PageRequest.of(0, skillLimit);

        // Obține skill-urile cu metadata
        List<Object[]> results = repository.findTopSkillsByLevel(personalId, pageable);

        List<TopSkillDto> topSkills = results.stream()
                .map(row -> {
                    Skill skill = (Skill) row[0];
                    EntityMetadata metadata = (EntityMetadata) row[1]; // poate fi null

                    // Calculează numărul de proiecte pentru acest skill
                    Integer projectCount = entitySkillRepository
                            .countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId());

                    // Determină culoarea
                    String color = getSkillColor(skill, metadata);

                    return TopSkillDto.builder()
                            .name(skill.getName())
                            .level(skill.getLevel())
                            .color(color)
                            // Optional fields
                            .category(skill.getCategory() != null ? skill.getCategory().getName() : null)
                            .proficiency(skill.getProficiency() != null ?
                                    skill.getProficiency().toString().toLowerCase() : null)
                            .projects(projectCount)
                            .build();
                })
                .toList();

        log.debug("Found {} top skills for personalId: {}", topSkills.size(), personalId);
        ServiceUtils.logMethodExit("getTopSkills", topSkills.size());
        return topSkills;
    }

    /**
     * Helper method pentru determinarea culorii skill-ului
     */
    private String getSkillColor(Skill skill, EntityMetadata metadata) {
        // 1. Încearcă din metadata
        if (metadata != null && metadata.getPrimaryColor() != null) {
            return metadata.getPrimaryColor();
        }

        // 2. Culoare bazată pe nivel
        if (skill.getLevel() != null) {
            return getColorByLevel(skill.getLevel());
        }

        // 3. Culoare bazată pe categorie
        if (skill.getCategory() != null) {
            return getColorByCategory(skill.getCategory().getName());
        }

        // 4. Default
        return "#3B82F6"; // Blue default
    }

    /**
     * Helper method pentru culori bazate pe nivel
     */
    private String getColorByLevel(Integer level) {
        if (level >= 90) return "#10B981"; // Green - Expert
        if (level >= 70) return "#F59E0B"; // Yellow - Advanced
        if (level >= 50) return "#3B82F6"; // Blue - Intermediate
        return "#6B7280"; // Gray - Beginner
    }

    /**
     * Helper method pentru culori bazate pe categorie
     */
    private String getColorByCategory(String categoryName) {
        if (categoryName == null) return "#3B82F6";

        return switch (categoryName.toLowerCase()) {
            case "technical skills", "programming" -> "#10B981"; // Green
            case "frameworks", "libraries" -> "#3B82F6"; // Blue
            case "databases" -> "#F59E0B"; // Yellow
            case "tools", "devops" -> "#8B5CF6"; // Purple
            case "soft skills", "communication" -> "#EC4899"; // Pink
            default -> "#6B7280"; // Gray
        };
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class SkillStatistics {
    private Long totalSkills;
    private Double averageLevel;
    private Map<String, Long> proficiencyDistribution;
    private Long featuredCount;
    private Long trendingCount;
    private Long learningCount;
}