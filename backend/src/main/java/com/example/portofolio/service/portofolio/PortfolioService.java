package com.example.portofolio.service.portofolio;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.EntityType;
import com.example.portofolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PortfolioService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final AchievementRepository achievementRepository;
    private final EducationRepository educationRepository;
    private final HobbyRepository hobbyRepository;
    private final InterestRepository interestRepository;
    private final EntityMetadataRepository entityMetadataRepository;
    private final ContactInfoRepository contactInfoRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

    // ===== PROJECTS =====

    public List<ProjectExportDto> getAllProjects(Long personalId) {
        return projectRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToProjectExportDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedProjectDto> getFeaturedProjects(Long personalId) {
        return projectRepository.findByPersonalId(personalId)
                .stream()
                .filter(project -> {
                    EntityMetadata metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId())
                            .orElse(null);
                    return metadata != null && metadata.getFeatured();
                })
                .map(this::mapToFeaturedProjectDto)
                .collect(Collectors.toList());
    }

    // ===== SKILLS =====

    public List<SkillDto> getAllSkills(Long personalId) {
        return skillRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToSkillDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedSkillDto> getFeaturedSkills(Long personalId) {
        return skillRepository.findByPersonalId(personalId)
                .stream()
                .filter(skill -> {
                    EntityMetadata metadata = entityMetadataRepository
                            .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId())
                            .orElse(null);
                    return metadata != null && metadata.getFeatured();
                })
                .map(this::mapToFeaturedSkillDto)
                .collect(Collectors.toList());
    }

//    public List<TopSkillDto> getTopSkills(Long personalId) {
//        return skillRepository.findByPersonalId(personalId)
//                .stream()
//                .sorted((a, b) -> b.getLevel().compareTo(a.getLevel()))
//                .limit(5)
//              .map(this::mapToTopSkillDto)
//                .collect(Collectors.toList());
//    }

    // ===== EDUCATION & CERTIFICATIONS =====

    public List<EducationDto> getAllEducation(Long personalId) {
        return educationRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToEducationDto)
                .collect(Collectors.toList());
    }

    public List<CertificationDto> getAllCertifications(Long personalId) {
        return certificateRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToCertificationDto)
                .collect(Collectors.toList());
    }

    // ===== ACHIEVEMENTS =====

    public List<AchievementDto> getAllAchievements(Long personalId) {
        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToAchievementDto)
                .collect(Collectors.toList());
    }

    public List<FeaturedAchievementDto> getFeaturedAchievements(Long personalId) {
        return achievementRepository.findByPersonalId(personalId)
                .stream()
                .sorted((a, b) -> b.getAchievementDate().compareTo(a.getAchievementDate()))
                .limit(3)
                .map(this::mapToFeaturedAchievementDto)
                .collect(Collectors.toList());
    }

    // ===== PERSONAL INSIGHTS =====

    public List<HobbyDto> getHobbies(Long personalId) {
        return hobbyRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToHobbyDto)
                .collect(Collectors.toList());
    }

    public List<InterestDto> getInterests(Long personalId) {
        return interestRepository.findByPersonalId(personalId)
                .stream()
                .map(this::mapToInterestDto)
                .collect(Collectors.toList());
    }

    // ===== CONTACT =====

    public ContactInfoDto getContactInfo(Long personalId) {
        Optional<ContactInfo> contactInfo = contactInfoRepository.findByPersonalId(personalId);
        return contactInfo != null ? mapToContactInfoDto(contactInfo) : null;
    }

    // ===== MAPPING METHODS =====

    private ProjectExportDto mapToProjectExportDto(Project project) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId())
                .orElse(null);

        return ProjectExportDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .longDescription(project.getLongDescription())
                .category(project.getCategory())
                .status(project.getStatus().toString())
                .featured(metadata != null ? metadata.getFeatured() : false)
                .demoUrl(project.getDemoUrl())
                .githubUrl(project.getGithubUrl())
                .developmentTime(project.getDevelopmentTime())
                .complexity(project.getComplexity().toString())
                .year(project.getYear())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private FeaturedProjectDto mapToFeaturedProjectDto(Project project) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.PROJECT, project.getId())
                .orElse(null);

        return FeaturedProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .shortDescription(truncateDescription(project.getDescription(), 100))
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getDemoUrl())
                .featured(metadata != null ? metadata.getFeatured() : false)
                .category(project.getCategory())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private SkillDto mapToSkillDto(Skill skill) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId())
                .orElse(null);

        return SkillDto.builder()
                .id(skill.getId().toString())
                .name(skill.getName())
                .level(skill.getLevel())
                .proficiency(skill.getProficiency().toString().toLowerCase())
                .description(skill.getDescription())
                .yearsOfExperience(skill.getYearsOfExperience().doubleValue())
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Star")
                .color(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .category(skill.getCategory().getName())
                .build();
    }

    private FeaturedSkillDto mapToFeaturedSkillDto(Skill skill) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId())
                .orElse(null);

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
                .build();
    }

//    private TopSkillDto mapToTopSkillDto(Skill skill) {
//        EntityMetadata metadata = entityMetadataRepository
//                .findByEntityTypeAndEntityId(EntityType.SKILL, skill.getId())
//                .orElse(null);
//
//        return TopSkillDto.builder()
//                .id(skill.getId().toString())
//                .name(skill.getName())
//                .level(skill.getLevel())
//                .color(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
//                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Star")
//                .categoryName(skill.getCategory().getName())
//                .proficiency(skill.getProficiency().toString().toLowerCase())
//                .build();
//    }

    private EducationDto mapToEducationDto(Education education) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.EDUCATION, education.getId())
                .orElse(null);

        return EducationDto.builder()
                .id(education.getId().toString())
                .level(education.getLevel().toString())
                .institution(education.getInstitution())
                .degree(education.getDegree())
                .field(education.getFieldOfStudy())
                .period(formatEducationPeriod(education))
                .location(education.getLocation())
                .description(education.getDescription())
                .status(education.getStatus().toString())
                .gpa(education.getGpa())
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "GraduationCap")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private CertificationDto mapToCertificationDto(Certificate certificate) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.CERTIFICATE, certificate.getId())
                .orElse(null);

        return CertificationDto.builder()
                .id(certificate.getId().toString())
                .title(certificate.getName())
                .provider(certificate.getProvider())
                .category(certificate.getCategory().getName())
                .issueDate(certificate.getIssueDate())
                .expiryDate(certificate.getExpiryDate())
                .hasExpiry(certificate.getHasExpiry())
                .credentialId(certificate.getCredentialId())
                .certificateUrl(certificate.getCertificateUrl())
                .description(certificate.getDescription())
                .verified(certificate.getVerified())
                .score(certificate.getScore())
                .relevanceScore(certificate.getRelevanceScore())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Award")
                .build();
    }

    private AchievementDto mapToAchievementDto(Achievement achievement) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.ACHIEVEMENT, achievement.getId())
                .orElse(null);

        return AchievementDto.builder()
                .id(achievement.getId().toString())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .date(achievement.getAchievementDate().format(dateFormatter))
                .type(achievement.getAchievementType().toString())
                .recognitionLevel(achievement.getRecognitionLevel().toString())
                .icon(metadata != null && metadata.getIcon() != null ? metadata.getIcon().getName() : "Award")
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
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

    private HobbyDto mapToHobbyDto(Hobby hobby) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.HOBBY, hobby.getId())
                .orElse(null);

        return HobbyDto.builder()
                .id(hobby.getId().toString())
                .name(hobby.getName())
                .description(hobby.getDescription())
                .category(hobby.getCategory().toString())
                .yearsActive(hobby.getYearsActive().doubleValue())
                .complexityLevel(hobby.getComplexityLevel().toString())
                .impactOnWork(hobby.getImpactOnWork().toString())
                .favoriteAspect(hobby.getFavoriteAspect())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private InterestDto mapToInterestDto(Interest interest) {
        EntityMetadata metadata = entityMetadataRepository
                .findByEntityTypeAndEntityId(EntityType.INTEREST, interest.getId())
                .orElse(null);

        return InterestDto.builder()
                .id(interest.getId().toString())
                .name(interest.getDescription())
                .description(interest.getDescription())
                .category(interest.getCategory().toString())
                .whyInterested(interest.getWhyInterested())
                .primaryColor(metadata != null ? metadata.getPrimaryColor() : "#3B82F6")
                .secondaryColor(metadata != null ? metadata.getSecondaryColor() : "#1E40AF")
                .build();
    }

    private ContactInfoDto mapToContactInfoDto(Optional<ContactInfo> contactInfo) {
        String location = "Unknown";
        if (contactInfo.get().getContactLocation() != null) {
            ContactLocation contactLocation = contactInfo.get().getContactLocation();
            location = contactLocation.getCity() + ", " + contactLocation.getCountry();
        }

        return ContactInfoDto.builder()
                .email(contactInfo.get().getEmail())
                .phone(contactInfo.get().getPhone())
                .location(location)
                .github(contactInfo.get().getGithub())
                .linkedin(contactInfo.get().getLinkedin())
                .build();
    }

    // ===== UTILITY METHODS =====

    private String truncateDescription(String description, int maxLength) {
        if (description == null || description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    }

    private String formatEducationPeriod(Education education) {
        String start = education.getStartDate().format(dateFormatter);
        if (education.getEndDate() == null) {
            return start + " - Present";
        }
        String end = education.getEndDate().format(dateFormatter);
        return start + " - " + end;
    }
}