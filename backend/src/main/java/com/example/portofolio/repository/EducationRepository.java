package com.example.portofolio.repository;

import com.example.portofolio.entity.Education;
import com.example.portofolio.entity.enums.EducationLevel;
import com.example.portofolio.entity.enums.EducationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {

    // Basic queries
    List<Education> findByPersonalId(Long personalId);

    List<Education> findByPersonalIdAndLevel(Long personalId, EducationLevel level);

    List<Education> findByPersonalIdAndStatus(Long personalId, EducationStatus status);

    List<Education> findByPersonalIdOrderByStartDateDesc(Long personalId);

    // Optimized queries
    @Query("SELECT e FROM Education e " +
            "LEFT JOIN FETCH e.courses c " +
            "LEFT JOIN FETCH e.achievements " +
            "WHERE e.personal.id = :personalId")
    List<Education> findByPersonalIdWithCoursesAndAchievements(@Param("personalId") Long personalId);

    @Query("SELECT e FROM Education e " +
            "LEFT JOIN FETCH e.courses c " +
            "WHERE e.personal.id = :personalId AND c.relevant = true")
    List<Education> findByPersonalIdWithRelevantCourses(@Param("personalId") Long personalId);

    @Query("SELECT e FROM Education e WHERE e.personal.id = :personalId AND e.status = :status")
    Education findCurrentByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT e FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "AND e.status = :status " +
            "ORDER BY e.startDate DESC")
    List<Education> findOngoingByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT e FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "AND e.status = :status " +
            "ORDER BY e.endDate DESC")
    List<Education> findCompletedByPersonalId(@Param("personalId") Long personalId);

    // Education by institution
    List<Education> findByPersonalIdAndInstitution(Long personalId, String institution);

    @Query("SELECT e.institution, COUNT(e) FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "GROUP BY e.institution")
    List<Object[]> countEducationByInstitution(@Param("personalId") Long personalId);

    // Education by field
    List<Education> findByPersonalIdAndFieldOfStudy(Long personalId, String fieldOfStudy);

    @Query("SELECT e.fieldOfStudy, COUNT(e) FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "GROUP BY e.fieldOfStudy")
    List<Object[]> countEducationByField(@Param("personalId") Long personalId);

    // Featured education
    @Query("SELECT e FROM Education e " +
            "JOIN EntityMetadata em ON em.entityType = 'EDUCATION' AND em.entityId = e.id " +
            "WHERE e.personal.id = :personalId AND em.featured = true " +
            "ORDER BY e.level DESC, e.startDate DESC")
    List<Education> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(e) FROM Education e WHERE e.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(e) FROM Education e " +
            "WHERE e.personal.id = :personalId AND e.status = :status")
    Long countByPersonalIdAndStatus(@Param("personalId") Long personalId,
                                    @Param("status") EducationStatus status);

    @Query("SELECT e.level, COUNT(e) FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "GROUP BY e.level")
    List<Object[]> countEducationByLevel(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT e FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "AND (LOWER(e.institution) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.degree) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.fieldOfStudy) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Education> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                  @Param("search") String search);

    // Timeline queries
    @Query("SELECT YEAR(e.startDate) as year, COUNT(e) FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "GROUP BY YEAR(e.startDate) " +
            "ORDER BY year DESC")
    List<Object[]> getEducationTimelineByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(DISTINCT YEAR(e.startDate)) FROM Education e WHERE e.personal.id = :personalId")
    Integer countAcademicYearsByPersonalId(@Param("personalId") Long personalId);


    /**
     * Verifică dacă există educație în desfășurare
     */
    @Query("SELECT COUNT(e) > 0 FROM Education e " +
            "WHERE e.personal.id = :personalId " +
            "AND e.endDate IS NULL")
    boolean hasOngoingEducation(@Param("personalId") Long personalId);




}