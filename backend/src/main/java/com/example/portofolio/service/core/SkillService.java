package com.example.portofolio.services.core;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.EntityMetadata;
import com.example.portofolio.entity.Skill;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.ProficiencyLevel;
import com.example.portofolio.repository.EntityMetadataRepository;
import com.example.portofolio.repository.EntitySkillRepository;
import com.example.portofolio.repository.SkillRepository;
import com.example.portofolio.services.base.BaseService;
import com.example.portofolio.repository.base.RepositoryUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing Skills data (read-only)
 */
@Service
@Slf4j
public class SkillService extends BaseService<Skill, Long, SkillRepository> {

    private final EntityMetadataRepository entityMetadataRepository;
    private final EntitySkillRepository entitySkillRepository;

    @Autowired
    public SkillService(SkillRepository skillRepository,
                        EntityMetadataRepository entityMetadataRepository,
                        EntitySkillRepository entitySkillRepository) {
        super(skillRepository);
        this.entityMetadataRepository = entityMetadataRepository;
        this.entitySkillRepository = entitySkillRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.SKILL.name();
    }

    // ===== PERSONAL SKILL QUERIES =====

    /**
     * Find all skills for a person
     */
    @Cacheable(value = "skills", key = "#personalId")
    public List<SkillDto> findByPersonalId(Long personalId) {
        log.debug("Finding skills for personal ID: {}", personalId);
        List<Skill> skills = repository.findByPersonalIdWithCategoryAndTags(personalId);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    /**
     * Find skills by category for a person
     */
    @Cacheable(value = "skillsByCategory", key = "#personalId + '_' + #categoryId")
    public List<SkillDto> findByPersonalIdAndCategory(Long personalId, Long categoryId) {
        log.debug("Finding skills for personal ID: {} and category: {}", personalId, categoryId);
        List<Skill> skills = repository.findByPersonalIdAndCategoryIdWithCategory(personalId, categoryId);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    /**
     * Find top skills for a person
     */
    @Cacheable(value = "topSkills", key = "#personalId + '_' + #limit")
    public List<TopSkillDto> findTopSkills(Long personalId, int limit) {
        log.debug("Finding top {} skills for personal ID: {}", limit, personalId);
        Pageable pageable = RepositoryUtils.createPageable(0, limit, "level", "desc");
        List<Skill> skills = repository.findTopSkillsByPersonalId(personalId, pageable);
        return skills.stream()
                .map(this::toTopSkillDto)
                .toList();
    }

    /**
     * Find featured skills for a person
     */
    @Cacheable(value = "featuredSkills", key = "#personalId")
    public List<FeaturedSkillDto> findFeaturedSkills(Long personalId) {
        log.debug("Finding featured skills for personal ID: {}", personalId);
        List<Skill> skills = repository.findFeaturedByPersonalId(personalId);
        return skills.stream()
                .map(this::toFeaturedSkillDto)
                .toList();
    }

    /**
     * Find core skills (high level, frequently used)
     */
    @Cacheable(value = "coreSkills", key = "#personalId")
    public List<CoreSkillDto> findCoreSkills(Long personalId) {
        log.debug("Finding core skills for personal ID: {}", personalId);
        List<Skill> skills = repository.findByPersonalIdAndLevelBetween(personalId, 80, 100);
        return skills.stream()
                .map(this::toCoreSkillDto)
                .toList();
    }

    /**
     * Find trending skills for a person
     */
    @Cacheable(value = "trendingSkills", key = "#personalId")
    public List<SkillDto> findTrendingSkills(Long personalId) {
        log.debug("Finding trending skills for personal ID: {}", personalId);
        List<Skill> skills = repository.findTrendingByPersonalId(personalId);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    /**
     * Find currently learning skills
     */
    @Cacheable(value = "learningSkills", key = "#personalId")
    public List<SkillDto> findCurrentlyLearning(Long personalId) {
        log.debug("Finding currently learning skills for personal ID: {}", personalId);
        List<Skill> skills = repository.findCurrentlyLearningByPersonalId(personalId);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    // ===== SEARCH & FILTERING =====

    /**
     * Search skills by name or description
     */
    public List<SkillDto> searchSkills(Long personalId, String searchTerm) {
        log.debug("Searching skills for personal ID: {} with term: {}", personalId, searchTerm);
        List<Skill> skills = repository.findByPersonalIdAndNameOrDescriptionContaining(personalId, searchTerm);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    /**
     * Find skills by proficiency level
     */
    public List<SkillDto> findByProficiency(Long personalId, ProficiencyLevel proficiency) {
        log.debug("Finding skills for personal ID: {} with proficiency: {}", personalId, proficiency);
        List<Skill> skills = repository.findByPersonalIdWithCategoryAndTags(personalId)
                .stream()
                .filter(skill -> skill.getProficiency() == proficiency)
                .toList();
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    /**
     * Find skills by level range
     */
    public List<SkillDto> findByLevelRange(Long personalId, int minLevel, int maxLevel) {
        log.debug("Finding skills for personal ID: {} with level between {} and {}",
                personalId, minLevel, maxLevel);
        List<Skill> skills = repository.findByPersonalIdAndLevelBetween(personalId, minLevel, maxLevel);
        return skills.stream()
                .map(this::toSkillDto)
                .toList();
    }

    // ===== STATISTICS =====

    /**
     * Get skill statistics for a person
     */
    @Cacheable(value = "skillStats", key = "#personalId")
    public SkillStatistics getSkillStatistics(Long personalId) {
        log.debug("Getting skill statistics for personal ID: {}", personalId);

        Long totalSkills = repository.countByPersonalId(personalId);
        Double avgLevel = repository.findAverageSkillLevelByPersonalId(personalId);

        Map<ProficiencyLevel, Long> proficiencyDistribution = ProficiencyLevel.getAllLevels()
                .stream()
                .collect(Collectors.toMap(
                        level -> level,
                        level -> repository.countByPersonalIdAndProficiency(personalId, level)
                ));

        return SkillStatistics.builder()
                .totalSkills(totalSkills)
                .averageLevel(avgLevel != null ? avgLevel : 0.0)
                .proficiencyDistribution(proficiencyDistribution)
                .featuredCount((long) findFeaturedSkills(personalId).size())
                .trendingCount((long) findTrendingSkills(personalId).size())
                .learningCount((long) findCurrentlyLearning(personalId).size())
                .build();
    }

    /**
     * Get skills grouped by category
     */
    @Cacheable(value = "skillsByCategory", key = "#personalId + '_grouped'")
    public List<FeaturedSkillCategoryDto> getSkillsGroupedByCategory(Long personalId) {
        log.debug("Getting skills grouped by category for personal ID: {}", personalId);

        List<Skill> skills = repository.findByPersonalIdWithCategoryAndTags(personalId);

        Map<String, List<Skill>> skillsByCategory = skills.stream()
                .filter(skill -> skill.getCategory() != null)
                .collect(Collectors.groupingBy(skill -> skill.getCategory().getName()));

        return skillsByCategory.entrySet().stream()
                .map(entry -> FeaturedSkillCategoryDto.builder()
                        .name(entry.getKey())
                        .skills(entry.getValue().stream()
                                .map(this::toFeaturedSkillDto)
                                .toList())
                        .icon(entry.getValue().get(0).getCategory().getIcon() != null ?
                                entry.getValue().get(0).getCategory().getIcon().getName() : null)
                        .description(entry.getValue().get(0).getCategory().getDescription())
                        .build())
                .toList();
    }

    // ===== PROJECT RELATIONSHIP QUERIES =====

    /**
     * Count projects using each skill
     */
    public Map<Long, Integer> getProjectCountBySkill(Long personalId) {
        log.debug("Getting project count by skill for personal ID: {}", personalId);

        List<Skill> skills = repository.findByPersonalId(personalId);
        return skills.stream()
                .collect(Collectors.toMap(
                        Skill::getId,
                        skill -> entitySkillRepository.countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId())
                ));
    }

    // ===== DTO CONVERSION METHODS =====

    @Override
    protected SkillDto toDto(Skill skill) {
        return toSkillDto(skill);
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
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .description(skill.getDescription())
                .yearsOfExperience(skill.getYearsOfExperience() != null ?
                        skill.getYearsOfExperience().doubleValue() : null)
                .projects(projectCount)
                .icon(metadata.map(em -> em.getIcon() != null ? em.getIcon().getName() : null).orElse(null))
                .color(metadata.map(EntityMetadata::getPrimaryColor).orElse(null))
                .category(skill.getCategory() != null ? skill.getCategory().getName() : null)
                .build();
    }

    private TopSkillDto toTopSkillDto(Skill skill) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId());

        Integer projectCount = entitySkillRepository
                .countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId());

        return TopSkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .color(metadata.map(EntityMetadata::getPrimaryColor).orElse(null))
                .icon(metadata.map(em -> em.getIcon() != null ? em.getIcon().getName() : null).orElse(null))
                .categoryName(skill.getCategory() != null ? skill.getCategory().getName() : null)
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .projects(projectCount)
                .build();
    }

    private FeaturedSkillDto toFeaturedSkillDto(Skill skill) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId());

        Integer projectCount = entitySkillRepository
                .countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId());

        // Get project names (simplified - you might want to optimize this)
        List<String> projectNames = List.of(); // TODO: Implement if needed

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
                .projects(projectNames)
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .trending(skill.getTrending())
                .learning(skill.getLearning())
                .build();
    }

    private CoreSkillDto toCoreSkillDto(Skill skill) {
        Optional<EntityMetadata> metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId());

        Integer projectCount = entitySkillRepository
                .countByEntityTypeAndSkillId(EntityType.PROJECT, skill.getId());

        // Get skill tags (simplified)
        List<String> tags = skill.getTags() != null ?
                skill.getTags().stream().map(tag -> tag.getTagName()).toList() :
                List.of();

        String experience = skill.getYearsOfExperience() != null ?
                String.format("%.1f years", skill.getYearsOfExperience().doubleValue()) :
                "Experience not specified";

        return CoreSkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .experience(experience)
                .color(metadata.map(EntityMetadata::getPrimaryColor).orElse(null))
                .tags(tags)
                .projects(projectCount)
                .build();
    }
}

// ===== SUPPORTING CLASSES =====

/**
 * Skill statistics DTO
 */
@lombok.Data
@lombok.Builder
class SkillStatistics {
    private Long totalSkills;
    private Double averageLevel;
    private Map<ProficiencyLevel, Long> proficiencyDistribution;
    private Long featuredCount;
    private Long trendingCount;
    private Long learningCount;
}