package com.example.portofolio.service.volunteer;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.VolunteerStatus;
import com.example.portofolio.entity.enums.VolunteerType;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.ServiceUtils;
import jakarta.persistence.Cacheable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class VolunteerService {

    private final VolunteerExperienceRepository volunteerRepository;
    private final AchievementRepository achievementRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final EntityMetadataRepository entityMetadataRepository;
    private final EntitySkillRepository entitySkillRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

    // ===== VOLUNTEER EXPERIENCES =====

    public List<VolunteerExperienceDto> getAllVolunteerExperiences(Long personalId) {
        log.debug("Getting all volunteer experiences for personal: {}", personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToVolunteerExperienceDto)
                .sorted((a, b) -> extractYear(b.getPeriod()).compareTo(extractYear(a.getPeriod())))
                .collect(Collectors.toList());
    }

    public List<VolunteerExperienceDto> getActiveVolunteerExperiences(Long personalId) {
        log.debug("Getting active volunteer experiences for personal: {}", personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .filter(volunteer -> volunteer.getStatus() == VolunteerStatus.ONGOIG)
                .map(this::mapToVolunteerExperienceDto)
                .collect(Collectors.toList());
    }

    public List<VolunteerExperienceDto> getVolunteerExperiencesByType(Long personalId, VolunteerType type) {
        log.debug("Getting volunteer experiences by type {} for personal: {}", type, personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .filter(volunteer -> volunteer.getType() == type)
                .map(this::mapToVolunteerExperienceDto)
                .collect(Collectors.toList());
    }

    // ===== VOLUNTEER STATISTICS =====

    public VolunteerStatsDto getVolunteerStatistics(Long personalId) {
        log.debug("Getting volunteer statistics for personal: {}", personalId);

        List<VolunteerExperience> experiences = volunteerRepository.findByPersonalId(personalId);

        // Calculate total years
        Integer totalYears = calculateTotalYearsVolunteering(experiences);

        // Count unique organizations
        Integer organizations = (int) experiences.stream()
                .map(VolunteerExperience::getOrganization)
                .distinct()
                .count();

        // Count projects coordinated (from achievements or responsibilities)
        Integer projectsCoordinated = calculateProjectsCoordinated(experiences);

        // Count events organized (estimate from responsibilities)
        Integer eventsOrganized = calculateEventsOrganized(experiences);

        return VolunteerStatsDto.builder()
                .totalYears(totalYears)
                .organizations(organizations)
                .projectsCoordinated(projectsCoordinated)
                .eventsOrganized(eventsOrganized)
                .build();
    }

    public Map<String, Long> getVolunteerTypeDistribution(Long personalId) {
        log.debug("Getting volunteer type distribution for personal: {}", personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        volunteer -> volunteer.getType().toString(),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getVolunteerStatusDistribution(Long personalId) {
        log.debug("Getting volunteer status distribution for personal: {}", personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        volunteer -> volunteer.getStatus().toString(),
                        Collectors.counting()
                ));
    }

    // ===== VOLUNTEER ACHIEVEMENTS =====

    public List<AchievementDto> getVolunteerAchievements(Long personalId) {
        log.debug("Getting volunteer achievements for personal: {}", personalId);

        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .filter(achievement -> achievement.getEntityType() == EntityType.VOLUNTEER)
                .map(this::mapToAchievementDto)
                .collect(Collectors.toList());
    }

    // ===== VOLUNTEER TIMELINE =====

    public List<TimelineItemDto> getVolunteerTimeline(Long personalId) {
        log.debug("Getting volunteer timeline for personal: {}", personalId);

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToTimelineItem)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }



    // ===== MAPPING METHODS =====

    private VolunteerExperienceDto mapToVolunteerExperienceDto(VolunteerExperience volunteer) {
        EntityMetadata metadata = getEntityMetadata(volunteer.getId());

        return VolunteerExperienceDto.builder()
                .id(volunteer.getId().toString())
                .organization(volunteer.getOrganization())
                .role(volunteer.getRole())
                .period(formatVolunteerPeriod(volunteer))
                .location(volunteer.getLocation())
                .type(volunteer.getType().toString())
                .status(volunteer.getStatus().toString())
                .description(volunteer.getDescription())
                .responsibilities(mapResponsibilities(volunteer.getResponsibilities()))
                .achievements(getVolunteerAchievements(volunteer))
                .skillsGained(getSkillsForVolunteer(volunteer.getId()))
                .impactLevel(volunteer.getImpactDescription())
                .website(volunteer.getWebsite())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Heart")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private List<ResponsibilityDto> mapResponsibilities(java.util.Set<VolunteerResponsibility> responsibilities) {
        return responsibilities.stream()
                .map(resp -> ResponsibilityDto.builder()
                        .id(resp.getId().toString())
                        .description(resp.getDescription())
                        .impactLevel(resp.getImpactLevel().toString())
                        .sortOrder(resp.getSortOrder())
                        .build())
                .sorted((a, b) -> a.getSortOrder().compareTo(b.getSortOrder()))
                .collect(Collectors.toList());
    }

    private List<AchievementDto> getVolunteerAchievements(VolunteerExperience volunteer) {
        return achievementRepository.findByPersonalId(volunteer.getPersonal().getId())
                .stream()
                .filter(achievement -> achievement.getEntityType() == EntityType.VOLUNTEER &&
                        achievement.getEntityId().equals(volunteer.getId()))
                .map(this::mapToAchievementDto)
                .collect(Collectors.toList());
    }

    private AchievementDto mapToAchievementDto(Achievement achievement) {
        EntityMetadata metadata = getEntityMetadata(achievement.getId());

        return AchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .date(achievement.getAchievementDate().format(dateFormatter))
                .type(achievement.getAchievementType().toString())
                .recognitionLevel(achievement.getRecognitionLevel().toString())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Award")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private TimelineItemDto mapToTimelineItem(VolunteerExperience volunteer) {
        EntityMetadata metadata = getEntityMetadata(volunteer.getId());

        return TimelineItemDto.builder()
                .id(volunteer.getId().toString())
                .year(String.valueOf(volunteer.getStartDate().getYear()))
                .title(volunteer.getRole())
                .subtitle(volunteer.getOrganization())
                .description(volunteer.getDescription())
                .type("volunteer")
                .current(volunteer.getStatus() == VolunteerStatus.ONGOIG)
                .achievements(getVolunteerAchievements(volunteer))
                .link(volunteer.getWebsite())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Heart")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    // ===== UTILITY METHODS =====

    private EntityMetadata getEntityMetadata(Long entityId) {
        return entityMetadataRepository.findByEntityTypeAndEntityId(EntityType.VOLUNTEER, entityId)
                .orElse(null);
    }

    private String formatVolunteerPeriod(VolunteerExperience volunteer) {
        String start = volunteer.getStartDate().format(dateFormatter);
        if (volunteer.getEndDate() == null) {
            return start + " - Present";
        }
        String end = volunteer.getEndDate().format(dateFormatter);
        return start + " - " + end;
    }

    private Integer calculateTotalYearsVolunteering(List<VolunteerExperience> experiences) {
        return experiences.stream()
                .mapToInt(volunteer -> {
                    LocalDate start = volunteer.getStartDate();
                    LocalDate end = volunteer.getEndDate() != null ? volunteer.getEndDate() : LocalDate.now();
                    return (int) ChronoUnit.YEARS.between(start, end);
                })
                .sum();
    }

    private Integer calculateProjectsCoordinated(List<VolunteerExperience> experiences) {
        // Estimate from responsibilities that contain "project", "coordinate", "lead"
        return experiences.stream()
                .mapToInt(volunteer -> (int) volunteer.getResponsibilities().stream()
                        .filter(resp -> resp.getDescription().toLowerCase()
                                .matches(".*(project|coordinate|lead|manage).*"))
                        .count())
                .sum();
    }

    private Integer calculateEventsOrganized(List<VolunteerExperience> experiences) {
        // Estimate from responsibilities that contain "event", "organize", "plan"
        return experiences.stream()
                .mapToInt(volunteer -> (int) volunteer.getResponsibilities().stream()
                        .filter(resp -> resp.getDescription().toLowerCase()
                                .matches(".*(event|organize|plan|workshop|conference).*"))
                        .count())
                .sum();
    }

    private List<String> getSkillsForVolunteer(Long volunteerId) {
        return entitySkillRepository.findByEntityTypeAndEntityId(EntityType.VOLUNTEER, volunteerId)
                .stream()
                .map(entitySkill -> entitySkill.getSkill().getName())
                .collect(Collectors.toList());
    }


    private FeaturedProjectDto mapToFeaturedProjectDto(Project project) {
        EntityMetadata metadata = getEntityMetadata(project.getId());

        return FeaturedProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getCategory())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getDemoUrl())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private Integer extractYear(String period) {
        // Extract year from period string (format: "MMM yyyy - MMM yyyy" or "MMM yyyy - Present")
        if (period == null || period.isEmpty()) {
            return LocalDate.now().getYear();
        }

        try {
            // Take the first year from the period
            String[] parts = period.split(" - ");
            String startPart = parts[0];
            String[] dateParts = startPart.split(" ");
            return Integer.valueOf(dateParts[dateParts.length - 1]);
        } catch (Exception e) {
            log.warn("Could not parse year from period: {}", period);
            return LocalDate.now().getYear();
        }
    }

    // ===== SEARCH AND FILTERING =====

    public List<VolunteerExperienceDto> searchVolunteerExperiences(Long personalId, String searchTerm) {
        log.debug("Searching volunteer experiences for '{}' and personal: {}", searchTerm, personalId);

        String lowerSearchTerm = searchTerm.toLowerCase();

        return volunteerRepository.findByPersonalId(personalId)
                .stream()
                .filter(volunteer ->
                        volunteer.getOrganization().toLowerCase().contains(lowerSearchTerm) ||
                                volunteer.getRole().toLowerCase().contains(lowerSearchTerm) ||
                                volunteer.getDescription().toLowerCase().contains(lowerSearchTerm)
                )
                .map(this::mapToVolunteerExperienceDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VolunteerExperienceDto saveVolunteerExperience(VolunteerExperience volunteerExperience) {
        log.info("Saving volunteer experience: {}", volunteerExperience.getOrganization());
        VolunteerExperience saved = volunteerRepository.save(volunteerExperience);
        return mapToVolunteerExperienceDto(saved);
    }

    @Transactional
    public void deleteVolunteerExperience(Long id) {
        log.info("Deleting volunteer experience with id: {}", id);
        volunteerRepository.deleteById(id);
    }

    /**
     * Returnează skill-urile dezvoltate prin voluntariat conform interfaței
     * { name: string; category: 'leadership' | 'technical' | 'communication' | 'project-management'; level: number; }
     */
    public List<VolunteerSkillDto> getVolunteerSkills(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("getVolunteerSkills", personalId);
        ServiceUtils.validatePersonalId(personalId);

        // 1. Obține toate skill-urile persoanei
        List<Skill> allSkills = skillRepository.findByPersonalId(personalId);

        // 2. Obține experiențele de voluntariat
        List<VolunteerExperience> volunteerExperiences = volunteerRepository.findByPersonalIdWithResponsibilities(personalId);

        // 3. Filtrează și mapează skill-urile relevante pentru voluntariat
        List<VolunteerSkillDto> volunteerSkills = allSkills.stream()
                .filter(this::isVolunteerRelevantSkill)
                .map(skill -> mapToVolunteerSkillDto(skill, volunteerExperiences))
                .filter(Objects::nonNull) // Elimină skill-urile care nu pot fi mapate
                .collect(Collectors.toList());

        log.debug("Found {} volunteer-relevant skills for personalId: {}", volunteerSkills.size(), personalId);
        ServiceUtils.logMethodExit("getVolunteerSkills", volunteerSkills.size());
        return volunteerSkills;
    }

    /**
     * Verifică dacă un skill este relevant pentru voluntariat
     */
    private boolean isVolunteerRelevantSkill(Skill skill) {
        if (skill.getCategory() == null && skill.getName() == null) {
            return false;
        }

        String skillName = skill.getName().toLowerCase();
        String categoryName = skill.getCategory() != null ? skill.getCategory().getName().toLowerCase() : "";

        // Skills care sunt în mod natural relevante pentru voluntariat
        return isLeadershipSkill(skillName, categoryName) ||
                isTechnicalSkill(skillName, categoryName) ||
                isCommunicationSkill(skillName, categoryName) ||
                isProjectManagementSkill(skillName, categoryName);
    }

    /**
     * Mapează un skill la VolunteerSkillDto
     */
    private VolunteerSkillDto mapToVolunteerSkillDto(Skill skill, List<VolunteerExperience> volunteerExperiences) {
        String category = determineVolunteerCategory(skill);
        if (category == null) {
            return null; // Skill-ul nu se potrivește cu categoriile volunteer
        }

        // Calculează experiența în voluntariat pentru acest skill
        int yearsOfExperience = calculateVolunteerExperienceYears(skill, volunteerExperiences);

        // Organizațiile unde a fost folosit (estimare bazată pe tipul de volunteer și skill)
        List<String> organizations = getRelevantOrganizations(skill, volunteerExperiences);

        // Verifică dacă este activ în voluntariat
        boolean isActive = hasActiveVolunteerWork(volunteerExperiences);

        return VolunteerSkillDto.builder()
                .name(skill.getName())
                .category(category)
                .level(skill.getLevel() != null ? skill.getLevel() : estimateLevel(skill, yearsOfExperience))
                .description(skill.getDescription())
                .organizations(organizations)
                .yearsOfExperience(yearsOfExperience)
                .isActive(isActive)
                .build();
    }

    /**
     * Determină categoria de volunteer pentru un skill
     */
    private String determineVolunteerCategory(Skill skill) {
        String skillName = skill.getName().toLowerCase();
        String categoryName = skill.getCategory() != null ? skill.getCategory().getName().toLowerCase() : "";

        if (isLeadershipSkill(skillName, categoryName)) {
            return "leadership";
        }
        if (isTechnicalSkill(skillName, categoryName)) {
            return "technical";
        }
        if (isCommunicationSkill(skillName, categoryName)) {
            return "communication";
        }
        if (isProjectManagementSkill(skillName, categoryName)) {
            return "project-management";
        }

        return null; // Nu se potrivește cu niciuna dintre categorii
    }

    // ===== HELPER METHODS PENTRU CATEGORII =====

    private boolean isLeadershipSkill(String skillName, String categoryName) {
        return skillName.contains("leadership") || skillName.contains("mentoring") || skillName.contains("coaching") ||
                skillName.contains("team building") || skillName.contains("motivation") ||
                categoryName.contains("leadership") || categoryName.contains("management");
    }

    private boolean isTechnicalSkill(String skillName, String categoryName) {
        return skillName.contains("programming") || skillName.contains("web") || skillName.contains("database") ||
                skillName.contains("java") || skillName.contains("react") || skillName.contains("python") ||
                skillName.contains("design") || skillName.contains("development") ||
                categoryName.contains("technical") || categoryName.contains("programming") || categoryName.contains("development");
    }

    private boolean isCommunicationSkill(String skillName, String categoryName) {
        return skillName.contains("communication") || skillName.contains("presentation") || skillName.contains("writing") ||
                skillName.contains("public speaking") || skillName.contains("negotiation") || skillName.contains("training") ||
                categoryName.contains("communication") || categoryName.contains("soft skills");
    }

    private boolean isProjectManagementSkill(String skillName, String categoryName) {
        return skillName.contains("project management") || skillName.contains("planning") || skillName.contains("coordination") ||
                skillName.contains("organization") || skillName.contains("scrum") || skillName.contains("agile") ||
                categoryName.contains("project") || categoryName.contains("management");
    }

    // ===== HELPER METHODS PENTRU CALCULE =====

    private int calculateVolunteerExperienceYears(Skill skill, List<VolunteerExperience> experiences) {
        // Calculează anii de experiență în voluntariat (simplificat)
        if (experiences.isEmpty()) {
            return 0;
        }

        LocalDate earliestStart = experiences.stream()
                .map(VolunteerExperience::getStartDate)
                .filter(date -> date != null)
                .min(LocalDate::compareTo)
                .orElse(LocalDate.now());

        return (int) ChronoUnit.YEARS.between(earliestStart, LocalDate.now());
    }

    private List<String> getRelevantOrganizations(Skill skill, List<VolunteerExperience> experiences) {
        // Returnează organizațiile (simplificat - toate organizațiile)
        return experiences.stream()
                .map(VolunteerExperience::getOrganization)
                .filter(org -> org != null && !org.trim().isEmpty())
                .distinct()
                .limit(3) // Limitează la primele 3 organizații
                .collect(Collectors.toList());
    }

    private boolean hasActiveVolunteerWork(List<VolunteerExperience> experiences) {
        return experiences.stream()
                .anyMatch(exp -> exp.getStatus() != null && "ACTIVE".equals(exp.getStatus().name()));
    }

    private Integer estimateLevel(Skill skill, int yearsOfExperience) {
        // Estimează nivel-ul bazat pe anii de experiență
        if (skill.getLevel() != null) {
            return skill.getLevel();
        }

        // Estimare simplă
        if (yearsOfExperience >= 5) return 90;
        if (yearsOfExperience >= 3) return 75;
        if (yearsOfExperience >= 1) return 60;
        return 40;
    }
}