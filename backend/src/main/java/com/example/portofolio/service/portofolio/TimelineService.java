package com.example.portofolio.service.portofolio;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TimelineService {

    private final AchievementRepository achievementRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final CertificateRepository certificateRepository;
    private final EntityMetadataRepository entityMetadataRepository;
    private final SkillRepository skillRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

    // ===== TIMELINE MILESTONES =====

    public List<TimelineMilestoneDto> getTimelineMilestones(Long personalId) {
        log.debug("Getting timeline milestones for personal: {}", personalId);

        List<TimelineMilestoneDto> milestones = new java.util.ArrayList<>();

        // Add achievements
        achievementRepository.findByPersonalId(personalId)
                .forEach(achievement -> milestones.add(mapAchievementToMilestone(achievement)));

        // Add education milestones
        educationRepository.findByPersonalId(personalId)
                .forEach(education -> milestones.add(mapEducationToMilestone(education)));

        // Add major projects (featured or complex ones)
        projectRepository.findByPersonalId(personalId)
                .stream()
                .filter(this::isMajorProject)
                .forEach(project -> milestones.add(mapProjectToMilestone(project)));

        // Add important certifications
        certificateRepository.findByPersonalId(personalId)
                .stream()
                .filter(cert -> cert.getVerified() || cert.getRelevanceScore() >= 80)
                .forEach(cert -> milestones.add(mapCertificateToMilestone(cert)));

        return milestones.stream()
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    // ===== TIMELINE ITEMS =====

    public List<TimelineItemDto> getTimelineItems(Long personalId) {
        log.debug("Getting timeline items for personal: {}", personalId);

        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapAchievementToTimelineItem)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    // ===== LEARNING MILESTONES =====

    public List<LearningMilestoneDto> getLearningMilestones(Long personalId) {
        log.debug("Getting learning milestones for personal: {}", personalId);

        List<LearningMilestoneDto> learningMilestones = new java.util.ArrayList<>();

        // Add technical achievements
        achievementRepository.findByPersonalId(personalId)
                .stream()
                .filter(achievement -> achievement.getAchievementType().toString().contains("TECHNICAL") ||
                        achievement.getAchievementType().toString().contains("ACADEMIC"))
                .forEach(achievement -> learningMilestones.add(mapAchievementToLearningMilestone(achievement)));

        // Add major projects as learning milestones
        projectRepository.findByPersonalId(personalId)
                .stream()
                .filter(project -> project.getComplexity().toString().equals("ADVANCED"))
                .forEach(project -> learningMilestones.add(mapProjectToLearningMilestone(project)));

        return learningMilestones.stream()
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    // ===== TIMELINE DATA =====

    public List<TimelineDataDto> getTimelineData(Long personalId) {
        log.debug("Getting timeline data for personal: {}", personalId);

        List<TimelineDataDto> timelineData = new java.util.ArrayList<>();

        // Education timeline data
        educationRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(e -> e.getStartDate().getYear(), Collectors.counting()))
                .forEach((year, count) -> {
                    timelineData.add(TimelineDataDto.builder()
                            .year(year)
                            .count(count)
                            .entityType("EDUCATION")
                            .build());
                });

        // Projects timeline data
        projectRepository.findByPersonalId(personalId)
                .stream()
                .filter(p -> p.getYear() != null)
                .collect(Collectors.groupingBy(Project::getYear, Collectors.counting()))
                .forEach((year, count) -> {
                    timelineData.add(TimelineDataDto.builder()
                            .year(year)
                            .count(count)
                            .entityType("PROJECT")
                            .build());
                });

        // Achievements timeline data
        achievementRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(a -> a.getAchievementDate().getYear(), Collectors.counting()))
                .forEach((year, count) -> {
                    timelineData.add(TimelineDataDto.builder()
                            .year(year)
                            .count(count)
                            .entityType("ACHIEVEMENT")
                            .build());
                });

        return timelineData.stream()
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    // ===== TIMELINE BY CATEGORY =====

    public List<TimelineMilestoneDto> getEducationTimeline(Long personalId) {
        log.debug("Getting education timeline for personal: {}", personalId);

        return educationRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapEducationToMilestone)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    public List<TimelineMilestoneDto> getProjectTimeline(Long personalId) {
        log.debug("Getting project timeline for personal: {}", personalId);

        return projectRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapProjectToMilestone)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    public List<TimelineMilestoneDto> getAchievementTimeline(Long personalId) {
        log.debug("Getting achievement timeline for personal: {}", personalId);

        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapAchievementToMilestone)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .collect(Collectors.toList());
    }

    // ===== MAPPING METHODS =====

    private TimelineMilestoneDto mapAchievementToMilestone(Achievement achievement) {
        EntityMetadata metadata = getEntityMetadata(EntityType.ACHIEVEMENT, achievement.getId());

        return TimelineMilestoneDto.builder()
                .id(achievement.getId().toString())
                .year(String.valueOf(achievement.getAchievementDate().getYear()))
                .title(achievement.getTitle())
                .category("achievement")
                .description(achievement.getDescription())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Award")
                .isActive(false)
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .importance(metadata != null ? metadata.getImportance().toString().toLowerCase() : "medium")
                .build();
    }

    private TimelineMilestoneDto mapEducationToMilestone(Education education) {
        EntityMetadata metadata = getEntityMetadata(EntityType.EDUCATION, education.getId());

        return TimelineMilestoneDto.builder()
                .id(education.getId().toString())
                .year(String.valueOf(education.getStartDate().getYear()))
                .title(education.getDegree())
                .category("education")
                .description(education.getInstitution() + " - " + education.getFieldOfStudy())
                .duration(calculateEducationDuration(education))
                .isActive(education.getEndDate() == null)
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "GraduationCap")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private TimelineMilestoneDto mapProjectToMilestone(Project project) {
        EntityMetadata metadata = getEntityMetadata(EntityType.PROJECT, project.getId());

        return TimelineMilestoneDto.builder()
                .id(project.getId().toString())
                .year(String.valueOf(project.getYear()))
                .title(project.getTitle())
                .category("project")
                .description(project.getDescription())
                .duration(project.getDevelopmentTime() != null ?
                        project.getDevelopmentTime() + " months" : null)
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Code")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private TimelineMilestoneDto mapCertificateToMilestone(Certificate certificate) {
        EntityMetadata metadata = getEntityMetadata(EntityType.CERTIFICATE, certificate.getId());

        return TimelineMilestoneDto.builder()
                .id(certificate.getId().toString())
                .year(String.valueOf(certificate.getIssueDate().getYear()))
                .title(certificate.getName())
                .category("certification")
                .description(certificate.getProvider() + " - " + certificate.getCategory().getName())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Award")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private TimelineItemDto mapAchievementToTimelineItem(Achievement achievement) {
        EntityMetadata metadata = getEntityMetadata(EntityType.ACHIEVEMENT, achievement.getId());

        return TimelineItemDto.builder()
                .id(achievement.getId().toString())
                .year(String.valueOf(achievement.getAchievementDate().getYear()))
                .title(achievement.getTitle())
                .subtitle(achievement.getAchievementType().toString())
                .description(achievement.getDescription())
                .type("achievement")
                .current(false)
                .link(achievement.getCertificateUrl())
                .icon(metadata != null && metadata.getIcon() != null ?
                        metadata.getIcon().getName() : "Award")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private LearningMilestoneDto mapAchievementToLearningMilestone(Achievement achievement) {
        return LearningMilestoneDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .year(String.valueOf(achievement.getAchievementDate().getYear()))
                .description(achievement.getDescription())
                .build();
    }

    private LearningMilestoneDto mapProjectToLearningMilestone(Project project) {
        // Get technologies from project (simplified - you'd need EntityTechnology for full implementation)
        List<String> technologies = getProjectTechnologies(project);

        return LearningMilestoneDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .year(String.valueOf(project.getYear()))
                .description(project.getDescription())
                .technologies(technologies)
                .build();
    }

    // ===== UTILITY METHODS =====

    private EntityMetadata getEntityMetadata(EntityType entityType, Long entityId) {
        return entityMetadataRepository.findByEntityTypeAndEntityId(entityType, entityId)
                .orElse(null);
    }

    private boolean isMajorProject(Project project) {
        // Consider a project major if it's featured OR complex
        EntityMetadata metadata = getEntityMetadata(EntityType.PROJECT, project.getId());
        boolean isFeatured = metadata != null && metadata.getFeatured();
        boolean isComplex = project.getComplexity().toString().equals("ADVANCED");

        return isFeatured || isComplex;
    }

    private String calculateEducationDuration(Education education) {
        if (education.getEndDate() == null) {
            return "Ongoing";
        }

        long years = ChronoUnit.YEARS.between(education.getStartDate(), education.getEndDate());
        if (years == 0) {
            long months = ChronoUnit.MONTHS.between(education.getStartDate(), education.getEndDate());
            return months + " months";
        }

        return years + (years == 1 ? " year" : " years");
    }

    private List<String> getProjectTechnologies(Project project) {
        // Simplified implementation - in real scenario you'd use EntityTechnology
        // For now, extract from project tags or use skills associated with project
        return project.getTags() != null ? project.getTags() : List.of();
    }

    // ===== ADVANCED TIMELINE METHODS =====

    public List<TimelineMilestoneDto> getTimelineByYear(Long personalId, Integer year) {
        log.debug("Getting timeline for year {} and personal: {}", year, personalId);

        return getTimelineMilestones(personalId)
                .stream()
                .filter(milestone -> milestone.getYear().equals(String.valueOf(year)))
                .collect(Collectors.toList());
    }

    public List<TimelineMilestoneDto> getTimelineByCategory(Long personalId, String category) {
        log.debug("Getting timeline for category {} and personal: {}", category, personalId);

        return getTimelineMilestones(personalId)
                .stream()
                .filter(milestone -> milestone.getCategory().equals(category))
                .collect(Collectors.toList());
    }

    public List<Integer> getActiveYears(Long personalId) {
        log.debug("Getting active years for personal: {}", personalId);

        return getTimelineMilestones(personalId)
                .stream()
                .map(milestone -> Integer.valueOf(milestone.getYear()))
                .distinct()
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());
    }
}