package com.example.portofolio.service.portofolio;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.entity.enums.EducationLevel;
import com.example.portofolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final EducationRepository educationRepository;
    private final AchievementRepository achievementRepository;
    private final EntityMetadataRepository entityMetadataRepository;

    // ===== PROJECT STATISTICS =====

    public ProjectStatisticsDto getProjectStatistics(Long personalId) {
        log.debug("Getting project statistics for personal: {}", personalId);

        List<Project> projects = projectRepository.findByPersonalId(personalId);

        // Category distribution
        Map<String, Long> categoryDistribution = projects.stream()
                .collect(Collectors.groupingBy(Project::getCategory, Collectors.counting()));

        // Status distribution
        Map<String, Long> statusDistribution = projects.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus().toString(), Collectors.counting()));

        // Featured count
        Long featuredCount = projects.stream()
                .filter(project -> {
                    return entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId())
                            .map(EntityMetadata::getFeatured)
                            .orElse(false);
                })
                .count();

        return ProjectStatisticsDto.builder()
                .totalProjects((long) projects.size())
                .categoryDistribution(categoryDistribution)
                .statusDistribution(statusDistribution)
                .featuredCount(featuredCount)
                .currentYear(LocalDate.now().getYear())
                .build();
    }

    // ===== SKILL STATISTICS =====

    public SkillStatisticsDto getSkillStatistics(Long personalId) {
        log.debug("Getting skill statistics for personal: {}", personalId);

        List<Skill> skills = skillRepository.findByPersonalId(personalId);

        // Average level
        Double averageLevel = skills.stream()
                .mapToInt(Skill::getLevel)
                .average()
                .orElse(0.0);

        // Proficiency distribution
        Map<String, Long> proficiencyDistribution = skills.stream()
                .collect(Collectors.groupingBy(s -> s.getProficiency().toString(), Collectors.counting()));

        // Featured count
        Long featuredCount = skills.stream()
                .filter(skill -> {
                    return entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId())
                            .map(EntityMetadata::getFeatured)
                            .orElse(false);
                })
                .count();

        // Trending count
        Long trendingCount = skills.stream()
                .filter(Skill::getTrending)
                .count();

        // Learning count
        Long learningCount = skills.stream()
                .filter(Skill::getLearning)
                .count();

        return SkillStatisticsDto.builder()
                .totalSkills((long) skills.size())
                .averageLevel(averageLevel)
                .proficiencyDistribution(proficiencyDistribution)
                .featuredCount(featuredCount)
                .trendingCount(trendingCount)
                .learningCount(learningCount)
                .build();
    }

    // ===== EDUCATION STATISTICS =====

    public EducationStatisticsDto getEducationStatistics(Long personalId) {
        log.debug("Getting education statistics for personal: {}", personalId);

        List<Education> educationList = educationRepository.findByPersonalId(personalId);

        // Basic counts
        Long totalEducation = (long) educationList.size();
        Long ongoingCount = educationList.stream()
                .filter(e -> e.getEndDate() == null)
                .count();
        Long completedCount = educationList.stream()
                .filter(e -> e.getEndDate() != null)
                .count();

        // Institution distribution
        Map<String, Long> institutionDistribution = educationList.stream()
                .collect(Collectors.groupingBy(Education::getInstitution, Collectors.counting()));

        // Field distribution
        Map<String, Long> fieldDistribution = educationList.stream()
                .collect(Collectors.groupingBy(Education::getFieldOfStudy, Collectors.counting()));

        // Level distribution
        Map<EducationLevel, Long> levelDistribution = educationList.stream()
                .collect(Collectors.groupingBy(Education::getLevel, Collectors.counting()));

        // Featured count
        Long featuredCount = educationList.stream()
                .filter(education -> {
                    return entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.EDUCATION, education.getId())
                            .map(EntityMetadata::getFeatured)
                            .orElse(false);
                })
                .count();

        return EducationStatisticsDto.builder()
                .totalEducation(totalEducation)
                .ongoingCount(ongoingCount)
                .completedCount(completedCount)
                .institutionDistribution(institutionDistribution)
                .fieldDistribution(fieldDistribution)
                .levelDistribution(levelDistribution)
                .featuredCount(featuredCount)
                .build();
    }




    // ===== TIMELINE DATA =====

    public List<TimelineDataDto> getTimelineData(Long personalId) {
        log.debug("Getting timeline data for personal: {}", personalId);

        // Education timeline data
        Map<Integer, Long> educationByYear = educationRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        e -> e.getStartDate().getYear(),
                        Collectors.counting()
                ));

        // Project timeline data
        Map<Integer, Long> projectsByYear = projectRepository.findByPersonalId(personalId)
                .stream()
                .filter(p -> p.getYear() != null)
                .collect(Collectors.groupingBy(
                        Project::getYear,
                        Collectors.counting()
                ));

        // Achievement timeline data
        Map<Integer, Long> achievementsByYear = achievementRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAchievementDate().getYear(),
                        Collectors.counting()
                ));

        // Combine all timeline data
        List<TimelineDataDto> timelineData = new java.util.ArrayList<>();

        // Add education data
        educationByYear.forEach((year, count) -> {
            timelineData.add(TimelineDataDto.builder()
                    .year(year)
                    .count(count)
                    .entityType("EDUCATION")
                    .build());
        });

        // Add project data
        projectsByYear.forEach((year, count) -> {
            timelineData.add(TimelineDataDto.builder()
                    .year(year)
                    .count(count)
                    .entityType("PROJECT")
                    .build());
        });

        // Add achievement data
        achievementsByYear.forEach((year, count) -> {
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

    // ===== FEATURED STATS =====

    public List<FeaturedStatDto> getFeaturedStats(Long personalId) {
        log.debug("Getting featured stats for personal: {}", personalId);

        // Count totals
        int totalProjects = projectRepository.findByPersonalId(personalId).size();
        int totalSkills = skillRepository.findByPersonalId(personalId).size();
        int totalCertificates = certificateRepository.findByPersonalId(personalId).size();
        int totalAchievements = achievementRepository.findByPersonalId(personalId).size();

        return List.of(
                FeaturedStatDto.builder()
                        .value(String.valueOf(totalProjects))
                        .label("Projects")
                        .icon("Code")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(totalSkills))
                        .label("Skills")
                        .icon("Star")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(totalCertificates))
                        .label("Certificates")
                        .icon("Award")
                        .build(),
                FeaturedStatDto.builder()
                        .value(String.valueOf(totalAchievements))
                        .label("Achievements")
                        .icon("Trophy")
                        .build()
        );
    }

    // ===== HERO TOTAL FEATURES =====

    public HeroTotalFeaturesDto getHeroTotalFeatures(Long personalId) {
        log.debug("Getting hero total features for personal: {}", personalId);

        // Count projects
        int nrOfProjects = projectRepository.findByPersonalId(personalId).size();

        // Count unique technologies (approximate from skills with "technology" in name)
        int nrOfTechnologies = (int) skillRepository.findByPersonalId(personalId)
                .stream()
                .filter(skill -> skill.getCategory().getName().toLowerCase().contains("tech") ||
                        skill.getName().toLowerCase().matches(".*(java|python|javascript|react|angular|spring).*"))
                .count();

        // Count academic years (distinct years from education)
        int nrAcademicYears = (int) educationRepository.findByPersonalId(personalId)
                .stream()
                .mapToInt(e -> e.getStartDate().getYear())
                .distinct()
                .count();

        // Count certifications
        int nrOfCertifications = certificateRepository.findByPersonalId(personalId).size();

        return HeroTotalFeaturesDto.builder()
                .nrOfProjects(nrOfProjects)
                .nrOfTechologies(nrOfTechnologies)
                .nrAcademicYears(nrAcademicYears)
                .nrOfCertifications(nrOfCertifications)
                .build();
    }

    // ===== CATEGORY STATISTICS =====

    public Map<String, Long> getSkillCategoryDistribution(Long personalId) {
        log.debug("Getting skill category distribution for personal: {}", personalId);

        return skillRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        skill -> skill.getCategory().getName(),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getProjectCategoryDistribution(Long personalId) {
        log.debug("Getting project category distribution for personal: {}", personalId);

        return projectRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        Project::getCategory,
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getAchievementTypeDistribution(Long personalId) {
        log.debug("Getting achievement type distribution for personal: {}", personalId);

        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .collect(Collectors.groupingBy(
                        achievement -> achievement.getAchievementType().toString(),
                        Collectors.counting()
                ));
    }

    // ===== PROGRESS ANALYSIS =====

    public Map<String, Object> getProgressAnalysis(Long personalId) {
        log.debug("Getting progress analysis for personal: {}", personalId);

        List<Skill> skills = skillRepository.findByPersonalId(personalId);
        List<Project> projects = projectRepository.findByPersonalId(personalId);

        // Skill level analysis
        long beginnerSkills = skills.stream().filter(s -> s.getLevel() < 30).count();
        long intermediateSkills = skills.stream().filter(s -> s.getLevel() >= 30 && s.getLevel() < 70).count();
        long advancedSkills = skills.stream().filter(s -> s.getLevel() >= 70).count();

        // Project complexity analysis
        long simpleProjects = projects.stream().filter(p -> p.getComplexity().toString().equals("BEGINNER")).count();
        long mediumProjects = projects.stream().filter(p -> p.getComplexity().toString().equals("INTERMEDIATE")).count();
        long complexProjects = projects.stream().filter(p -> p.getComplexity().toString().equals("ADVANCED")).count();

        return Map.of(
                "skillLevels", Map.of(
                        "beginner", beginnerSkills,
                        "intermediate", intermediateSkills,
                        "advanced", advancedSkills
                ),
                "projectComplexity", Map.of(
                        "simple", simpleProjects,
                        "medium", mediumProjects,
                        "complex", complexProjects
                ),
                "totalSkills", skills.size(),
                "totalProjects", projects.size(),
                "averageSkillLevel", skills.stream().mapToInt(Skill::getLevel).average().orElse(0.0)
        );
    }

    // ===== GROWTH METRICS =====

    public Map<String, Object> getGrowthMetrics(Long personalId) {
        log.debug("Getting growth metrics for personal: {}", personalId);

        List<Achievement> achievements = achievementRepository.findByPersonalId(personalId);
        List<Project> projects = projectRepository.findByPersonalId(personalId);
        List<Certificate> certificates = certificateRepository.findByPersonalId(personalId);

        // Recent activity (last year)
        int currentYear = LocalDate.now().getYear();

        long recentAchievements = achievements.stream()
                .filter(a -> a.getAchievementDate().getYear() == currentYear)
                .count();

        long recentProjects = projects.stream()
                .filter(p -> p.getYear() != null && p.getYear() == currentYear)
                .count();

        long recentCertificates = certificates.stream()
                .filter(c -> c.getIssueDate().getYear() == currentYear)
                .count();

        return Map.of(
                "currentYear", currentYear,
                "recentAchievements", recentAchievements,
                "recentProjects", recentProjects,
                "recentCertificates", recentCertificates,
                "totalActivity", recentAchievements + recentProjects + recentCertificates
        );
    }
}