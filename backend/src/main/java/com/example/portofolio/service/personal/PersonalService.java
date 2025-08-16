package com.example.portofolio.service.personal;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PersonalService {

    // Repository dependencies bazate pe entitățile existente
    private final PersonalRepository personalRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final AchievementRepository achievementRepository;
    private final EducationRepository educationRepository;
    private final ContactInfoRepository contactInfoRepository;
    private final EntityMetadataRepository entityMetadataRepository;
    private final LearningProgressRepository learningProgressRepository;
    private final FutureGoalRepository futureGoalRepository;
    private final EntitySkillRepository entitySkillRepository;
    private final EntityTechnologyRepository entityTechnologyRepository;
    private final HighlightRepository highlightRepository;
    private final PersonalValueRepository personalValueRepository;
    private final PersonalityTraitRepository personalityTraitRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

    // ===== BASIC PERSONAL OPERATIONS =====

    public Optional<Personal> findById(Long id) {
        return personalRepository.findById(id);
    }

    public List<Personal> findAll() {
        return personalRepository.findAll();
    }

    @Transactional
    public Personal save(Personal personal) {
        log.info("Saving personal profile: {} {}", personal.getFirstName(), personal.getLastName());
        return personalRepository.save(personal);
    }

    @Transactional
    public void deleteById(Long id) {
        log.info("Deleting personal profile with id: {}", id);
        personalRepository.deleteById(id);
    }

    // ===== HERO SECTION DATA =====

    public HeroTotalFeaturesDto getHeroTotalFeatures(Long personalId) {
        log.debug("Getting hero total features for personal: {}", personalId);

        // Count projects
        Integer nrOfProjects = Math.toIntExact(projectRepository.countByPersonalId(personalId));

        // Count unique technologies used in projects
        Integer nrOfTechnologies = entityTechnologyRepository.countDistinctTechnologiesByPersonalId(personalId);

        // Count academic years from education
        Integer nrAcademicYears = educationRepository.countAcademicYearsByPersonalId(personalId);

        // Count certificates
        Integer nrOfCertifications = Math.toIntExact(certificateRepository.countByPersonalId(personalId));

        return HeroTotalFeaturesDto.builder()
                .nrOfProjects(nrOfProjects != null ? nrOfProjects : 0)
                .nrOfTechologies(nrOfTechnologies != null ? nrOfTechnologies : 0)
                .nrAcademicYears(nrAcademicYears != null ? nrAcademicYears : 0)
                .nrOfCertifications(nrOfCertifications != null ? nrOfCertifications : 0)
                .build();
    }

    public HomeStoryHighLightsDto getHomeStoryHighlights(Long personalId) {
        log.debug("Getting home story highlights for personal: {}", personalId);

        Personal personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new RuntimeException("Personal not found with id: " + personalId));

        // Get current education for role
        Education currentEducation = educationRepository.findCurrentByPersonalId(personalId);
        String currentRole = currentEducation != null ? currentEducation.getDegree() : "Student";

        // Get location from contact info
        Optional<ContactInfo> contactInfo = contactInfoRepository.findByPersonalId(personalId);
        String location = "Unknown";
        if (contactInfo != null && contactInfo.get().getContactLocation() != null) {
            ContactLocation contactLocation = contactInfo.get().getContactLocation();
            location = contactLocation.getCity() + ", " + contactLocation.getCountry();
        }

        // Get education institution
        String education = currentEducation != null ? currentEducation.getInstitution() : "";

        return HomeStoryHighLightsDto.builder()
                .currentRole(currentRole)
                .location(location)
                .education(education)
                .passion("Technology & Innovation") // Poate fi făcut dinamic din personal description
                .goal("Building impactful software solutions") // Similar
                .build();
    }

    public List<HomeContactMethodDto> getHomeContactMethods(Long personalId) {
        log.debug("Getting home contact methods for personal: {}", personalId);

        Optional<ContactInfo> contactInfo = contactInfoRepository.findByPersonalId(personalId);
        if (contactInfo == null) {
            return List.of();
        }

        return List.of(
                        createContactMethod("email", "Email", contactInfo.get().getEmail(),
                                "Mail", "mailto:" + contactInfo.get().getEmail(), "Send me an email"),
                        createContactMethod("linkedin", "LinkedIn", contactInfo.get().getLinkedin(),
                                "Linkedin", "https://linkedin.com/in/" + contactInfo.get().getLinkedin(), "Connect on LinkedIn"),
                        createContactMethod("github", "GitHub", contactInfo.get().getGithub(),
                                "Github", "https://github.com/" + contactInfo.get().getGithub(), "Check out my code"),
                        createContactMethod("phone", "Phone", contactInfo.get().getPhone(),
                                "Phone", "tel:" + contactInfo.get().getPhone(), "Give me a call"),
                        createContactMethod("website", "Website", contactInfo.get().getWebsite(),
                                "Globe", contactInfo.get().getWebsite(), "Visit my website")
                ).stream()
                .filter(method -> method.getValue() != null && !method.getValue().isEmpty())
                .collect(Collectors.toList());
    }

    // ===== FEATURED CONTENT =====

    public List<FeaturedProjectDto> getFeaturedProjects(Long personalId, int limit) {
        log.debug("Getting {} featured projects for personal: {}", limit, personalId);

        return projectRepository.findFeaturedByPersonalId(personalId, Pageable.ofSize(limit))
                .stream()
                .map(this::mapToFeaturedProjectDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedSkillDto> getFeaturedSkills(Long personalId, int limit) {
        log.debug("Getting {} featured skills for personal: {}", limit, personalId);

        return skillRepository.findFeaturedByPersonalId(personalId, Pageable.ofSize(limit))
                .stream()
                .map(this::mapToFeaturedSkillDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedAchievementDto> getFeaturedAchievements(Long personalId, int limit) {
        log.debug("Getting {} featured achievements for personal: {}", limit, personalId);

        return achievementRepository.findFeaturedByPersonalId(personalId, Pageable.ofSize(limit))
                .stream()
                .map(this::mapToFeaturedAchievementDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedStatDto> getFeaturedStats(Long personalId) {
        log.debug("Getting featured stats for personal: {}", personalId);

        return List.of(
                FeaturedStatDto.builder()
                        .value(String.valueOf(projectRepository.countByPersonalId(personalId)))
                        .label("Projects")
                        .icon("Code")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(skillRepository.countByPersonalId(personalId)))
                        .label("Skills")
                        .icon("Star")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(certificateRepository.countByPersonalId(personalId)))
                        .label("Certificates")
                        .icon("Award")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(achievementRepository.countByPersonalId(personalId)))
                        .label("Achievements")
                        .icon("Trophy")
                        .build()
        );
    }

    // ===== TIMELINE AND LEARNING =====

    public List<TimelineMilestoneDto> getTimelineMilestones(Long personalId) {
        log.debug("Getting timeline milestones for personal: {}", personalId);

        List<TimelineMilestoneDto> milestones = new java.util.ArrayList<>();

        // Add achievements to timeline
        achievementRepository.findByPersonalIdOrderByAchievementDateDesc(personalId)
                .forEach(achievement -> milestones.add(mapAchievementToTimeline(achievement)));

        // Add education milestones
        educationRepository.findByPersonalIdOrderByStartDateDesc(personalId)
                .forEach(education -> milestones.add(mapEducationToTimeline(education)));

        // Add major projects
        projectRepository.findMajorProjectsByPersonalId(personalId)
                .forEach(project -> milestones.add(mapProjectToTimeline(project)));

        // Sort by year descending
        return milestones.stream()
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    public List<CurrentLearningDto> getCurrentLearning(Long personalId) {
        log.debug("Getting current learning for personal: {}", personalId);

        return learningProgressRepository.findActiveByPersonalId(personalId)
                .stream()
                .map(this::mapToCurrentLearningDto)
                .collect(Collectors.toList());
    }

    public List<FutureGoalDto> getFutureGoals(Long personalId) {
        log.debug("Getting future goals for personal: {}", personalId);

        return futureGoalRepository.findByPersonalIdOrderByPriorityDesc(personalId)
                .stream()
                .map(this::mapToFutureGoalDto)
                .collect(Collectors.toList());
    }
    /**
     * Returnează toate highlight-urile pentru o persoană
     */
    public List<HighlightDto> getPersonalHighlights(Long personalId) {
        log.debug("Getting personal highlights for personal: {}", personalId);

        List<Highlight> highlights = highlightRepository.findByPersonalIdWithIcon(personalId);

        return highlights.stream()
                .map(this::mapToHighlightDto)
                .collect(Collectors.toList());
    }

    /**
     * Returnează toate valorile personale pentru o persoană
     */
    public List<PersonalValueDto> getPersonalValues(Long personalId) {
        log.debug("Getting personal values for personal: {}", personalId);

        List<PersonalValue> personalValues = personalValueRepository.findByPersonalIdWithIcon(personalId);

        return personalValues.stream()
                .map(this::mapToPersonalValueDto)
                .collect(Collectors.toList());
    }



    // ===== PRIVATE MAPPING METHODS =====

    private HomeContactMethodDto createContactMethod(String id, String label, String value,
                                                     String icon, String href, String description) {
        return HomeContactMethodDto.builder()
                .id(id)
                .label(label)
                .value(value)
                .icon(icon)
                .href(href)
                .description(description)
                .build();
    }

    private FeaturedProjectDto mapToFeaturedProjectDto(Project project) {
        EntityMetadata metadata = getEntityMetadata(EntityType.PROJECT, project.getId());

        return FeaturedProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .shortDescription(truncateDescription(project.getDescription(), 100))
                .technologies(getTechnologiesForProject(project.getId()))
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getDemoUrl())
                .featured(metadata != null ? metadata.getFeatured() : false)
                .category(project.getCategory())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private FeaturedSkillDto mapToFeaturedSkillDto(Skill skill) {
        EntityMetadata metadata = getEntityMetadata(EntityType.SKILL, skill.getId());

        return FeaturedSkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .categoryName(skill.getCategory().getName())
                .description(skill.getDescription())
                .yearsOfExperience(skill.getYearsOfExperience().doubleValue())
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .trending(skill.getTrending())
                .learning(skill.getLearning())
                .color(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Star")
                .projects(getProjectNamesForSkill(skill.getId()))
                .build();
    }

    private FeaturedAchievementDto mapToFeaturedAchievementDto(Achievement achievement) {
        return FeaturedAchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .year(achievement.getAchievementDate().getYear())
                .build();
    }

    private TimelineMilestoneDto mapAchievementToTimeline(Achievement achievement) {
        EntityMetadata metadata = getEntityMetadata(EntityType.ACHIEVEMENT, achievement.getId());

        return TimelineMilestoneDto.builder()
                .id(achievement.getId().toString())
                .year(String.valueOf(achievement.getAchievementDate().getYear()))
                .title(achievement.getTitle())
                .category("achievement")
                .description(achievement.getDescription())
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Award")
                .isActive(false)
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .importance(metadata != null ? metadata.getImportance().toString().toLowerCase() : "medium")
                .build();
    }

    private TimelineMilestoneDto mapEducationToTimeline(Education education) {
        EntityMetadata metadata = getEntityMetadata(EntityType.EDUCATION, education.getId());

        return TimelineMilestoneDto.builder()
                .id(education.getId().toString())
                .year(String.valueOf(education.getStartDate().getYear()))
                .title(education.getDegree())
                .category("education")
                .description(education.getInstitution() + " - " + education.getFieldOfStudy())
                .duration(calculateEducationDuration(education))
                .isActive(education.getEndDate() == null)
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "GraduationCap")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }



    private TimelineMilestoneDto mapProjectToTimeline(Project project) {
        EntityMetadata metadata = getEntityMetadata(EntityType.PROJECT, project.getId());

        return TimelineMilestoneDto.builder()
                .id(project.getId().toString())
                .year(String.valueOf(project.getYear()))
                .title(project.getTitle())
                .category("project")
                .description(project.getDescription())
                .technologies(getTechnologiesForProject(project.getId()))
                .duration(project.getDevelopmentTime() != null ? project.getDevelopmentTime() + " months" : null)
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Code")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private CurrentLearningDto mapToCurrentLearningDto(LearningProgress learning) {
        EntityMetadata metadata = getEntityMetadata(EntityType.SKILL, learning.getSkill().getId());

        return CurrentLearningDto.builder()
                .id(learning.getId().toString())
                .title(learning.getName())
                .status(learning.getStatus().toString().toLowerCase())
                .progress(learning.getProgressPercentage())
                .description(learning.getDescription())
                .startDate(learning.getStartDate() != null ? learning.getStartDate().format(dateFormatter) : null)
                .expectedCompletion(learning.getEstimatedCompletion())
                .color(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "BookOpen")
                .gradient(metadata != null ? metadata.getGradient() : null)
                .build();
    }

    private FutureGoalDto mapToFutureGoalDto(FutureGoal goal) {
        EntityMetadata metadata = getEntityMetadata(EntityType.SKILL, goal.getId()); // Assuming goals can have metadata

        return FutureGoalDto.builder()
                .id(goal.getId().toString())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .targetDate(goal.getTargetDate() != null ? goal.getTargetDate().format(dateFormatter) : null)
                .priority(goal.getPriority().toString().toLowerCase())
                .color(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .icon(goal.getIcon() != null ? goal.getIcon().getName() : "Target")
                .gradient(metadata != null ? metadata.getGradient() : null)
                .build();
    }

    private PersonalHighlightDto mapToPersonalHighlightDto(Highlight highlight) {
        EntityMetadata metadata = getEntityMetadata(EntityType.PERSONAL, highlight.getId());

        return PersonalHighlightDto.builder()
                .id(highlight.getId().toString())
                .title(highlight.getTitle())
                .description(highlight.getDescription())
                .icon(highlight.getIcon() != null ? highlight.getIcon().getName() : "Star")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private PersonalValueDto mapToPersonalValueDto(PersonalValue value) {
        return PersonalValueDto.builder()
                .id(value.getId().toString())
                .title(value.getTitle())
                .description(value.getDescription())
                .icon(value.getIcon() != null ? value.getIcon().getName() : "Heart")
                .importanceLevel(value.getImportanceLevel().toString().toLowerCase())
                .build();
    }

    private PersonalityTraitDto mapToPersonalityTraitDto(PersonalityTrait trait) {
        List<String> examples = trait.getExamples().stream()
                .map(PersonalityExample::getTitle)
                .collect(Collectors.toList());

        return PersonalityTraitDto.builder()
                .id(trait.getId().toString())
                .trait(trait.getTrait())
                .description(trait.getDescription())
                .icon(trait.getIcon() != null ? trait.getIcon().getName() : "User")
                .examples(examples)
                .build();
    }

    // Adaugă metoda de mapping pentru HighlightDto
    private HighlightDto mapToHighlightDto(Highlight highlight) {
        EntityMetadata metadata = getEntityMetadata(EntityType.HIGHLIGHT, highlight.getId());

        return HighlightDto.builder()
                .id(highlight.getId().toString())
                .title(highlight.getTitle())
                .description(highlight.getDescription())
                .highlightType(highlight.getHighlightType() != null ?
                        highlight.getHighlightType().toString().toLowerCase() : null)
                .priorityLevel(highlight.getPriorityLevel() != null ?
                        highlight.getPriorityLevel().toString().toLowerCase() : null)
                .icon(highlight.getIcon() != null ?
                        highlight.getIcon().getName() :
                        getDefaultHighlightIcon(highlight.getHighlightType()))
                .build();
    }

    // Helper methods pentru highlight-uri
    private String getDefaultHighlightIcon(Object highlightType) {
        if (highlightType == null) return "Star";

        String type = highlightType.toString().toLowerCase();
        return switch (type) {
            case "achievement" -> "Trophy";
            case "skill" -> "Code";
            case "project" -> "Folder";
            case "education" -> "GraduationCap";
            case "experience" -> "Briefcase";
            case "certification" -> "Award";
            default -> "Star";
        };
    }

    private String getDefaultHighlightColor(Object highlightType) {
        if (highlightType == null) return "#3B82F6";

        String type = highlightType.toString().toLowerCase();
        return switch (type) {
            case "achievement" -> "#F59E0B"; // Yellow/Gold
            case "skill" -> "#10B981";       // Green
            case "project" -> "#3B82F6";     // Blue
            case "education" -> "#8B5CF6";   // Purple
            case "experience" -> "#EF4444";  // Red
            case "certification" -> "#EC4899"; // Pink
            default -> "#3B82F6";
        };
    }

    private String getDefaultHighlightSecondaryColor(Object highlightType) {
        if (highlightType == null) return "#93C5FD";

        String type = highlightType.toString().toLowerCase();
        return switch (type) {
            case "achievement" -> "#FCD34D"; // Light Yellow
            case "skill" -> "#6EE7B7";       // Light Green
            case "project" -> "#93C5FD";     // Light Blue
            case "education" -> "#C4B5FD";   // Light Purple
            case "experience" -> "#FCA5A5";  // Light Red
            case "certification" -> "#F9A8D4"; // Light Pink
            default -> "#93C5FD";
        };
    }



    // Helper method pentru iconuri valori personale
    private String getDefaultValueIcon(String title) {
        if (title == null) return "Heart";

        String lowerTitle = title.toLowerCase();
        if (lowerTitle.contains("integrity") || lowerTitle.contains("honesty")) return "Shield";
        if (lowerTitle.contains("innovation") || lowerTitle.contains("creativity")) return "Lightbulb";
        if (lowerTitle.contains("teamwork") || lowerTitle.contains("collaboration")) return "Users";
        if (lowerTitle.contains("excellence") || lowerTitle.contains("quality")) return "Star";
        if (lowerTitle.contains("growth") || lowerTitle.contains("learning")) return "TrendingUp";
        if (lowerTitle.contains("respect") || lowerTitle.contains("diversity")) return "Heart";
        if (lowerTitle.contains("responsibility") || lowerTitle.contains("accountability")) return "CheckCircle";
        if (lowerTitle.contains("passion") || lowerTitle.contains("dedication")) return "Flame";

        return "Heart"; // Default
    }

    // Adaugă în PersonalService

    /**
     * Returnează toate trăsăturile de personalitate pentru o persoană
     */
    public List<PersonalityTraitDto> getPersonalityTraits(Long personalId) {
        log.debug("Getting personality traits for personal: {}", personalId);

        List<PersonalityTrait> personalityTraits = personalityTraitRepository.findByPersonalIdWithIconAndExamples(personalId);

        return personalityTraits.stream()
                .map(this::mapToPersonalityTraitDto)
                .collect(Collectors.toList());
    }

    /**
     * Actualizează metoda existentă mapToPersonalityTraitDto pentru a fi mai robustă
     */

    /**
     * Helper method pentru iconuri default pentru trăsături de personalitate
     */
    private String getDefaultPersonalityIcon(String trait) {
        if (trait == null) return "User";

        String lowerTrait = trait.toLowerCase();

        // Leadership traits
        if (lowerTrait.contains("leadership") || lowerTrait.contains("leader")) return "Crown";
        if (lowerTrait.contains("confident") || lowerTrait.contains("confidence")) return "Shield";
        if (lowerTrait.contains("decisive") || lowerTrait.contains("decision")) return "CheckCircle";

        // Communication traits
        if (lowerTrait.contains("communicat") || lowerTrait.contains("speaker")) return "MessageCircle";
        if (lowerTrait.contains("empathy") || lowerTrait.contains("empathetic")) return "Heart";
        if (lowerTrait.contains("listening") || lowerTrait.contains("listener")) return "Ear";

        // Creative traits
        if (lowerTrait.contains("creative") || lowerTrait.contains("creativity")) return "Lightbulb";
        if (lowerTrait.contains("innovative") || lowerTrait.contains("innovation")) return "Zap";
        if (lowerTrait.contains("artistic") || lowerTrait.contains("art")) return "Palette";

        // Analytical traits
        if (lowerTrait.contains("analytical") || lowerTrait.contains("logical")) return "Brain";
        if (lowerTrait.contains("detail") || lowerTrait.contains("precise")) return "Search";
        if (lowerTrait.contains("strategic") || lowerTrait.contains("planning")) return "Target";

        // Social traits
        if (lowerTrait.contains("teamwork") || lowerTrait.contains("collaborative")) return "Users";
        if (lowerTrait.contains("friendly") || lowerTrait.contains("social")) return "Smile";
        if (lowerTrait.contains("patient") || lowerTrait.contains("patience")) return "Clock";

        // Work traits
        if (lowerTrait.contains("organized") || lowerTrait.contains("organization")) return "Calendar";
        if (lowerTrait.contains("reliable") || lowerTrait.contains("dependable")) return "CheckSquare";
        if (lowerTrait.contains("adaptable") || lowerTrait.contains("flexible")) return "RefreshCw";

        // Energy traits
        if (lowerTrait.contains("energetic") || lowerTrait.contains("enthusiastic")) return "Zap";
        if (lowerTrait.contains("motivated") || lowerTrait.contains("driven")) return "TrendingUp";
        if (lowerTrait.contains("persistent") || lowerTrait.contains("determined")) return "Flag";

        return "User"; // Default icon
    }



    // ===== UTILITY METHODS =====

    private EntityMetadata getEntityMetadata(EntityType entityType, Long entityId) {
        return entityMetadataRepository.findByEntityTypeAndEntityId(entityType, entityId)
                .orElse(null);
    }

    private List<String> getTechnologiesForProject(Long projectId) {
        return entityTechnologyRepository.findTechnologyNamesByProjectId(projectId);
    }

    private List<String> getProjectNamesForSkill(Long skillId) {
        return entitySkillRepository.findProjectNamesBySkillId(skillId);
    }

    private String truncateDescription(String description, int maxLength) {
        if (description == null || description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    }

    private String calculateEducationDuration(Education education) {
        if (education.getEndDate() == null) {
            return "Ongoing";
        }
        long years = education.getStartDate().until(education.getEndDate()).getYears();
        return years + (years == 1 ? " year" : " years");
    }
}