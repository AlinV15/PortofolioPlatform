package com.example.portofolio.repository;

import com.example.portofolio.entity.CourseProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseProjectRepository extends JpaRepository<CourseProject, Long> {

    /**
     * Găsește toate proiectele academice pentru o persoană prin cursuri și educație
     */
    @Query("SELECT cp FROM CourseProject cp " +
            "LEFT JOIN FETCH cp.project p " +
            "LEFT JOIN FETCH cp.course c " +
            "LEFT JOIN FETCH c.education e " +
            "WHERE e.personal.id = :personalId " +
            "ORDER BY e.startDate DESC, c.title ASC, p.title ASC")
    List<CourseProject> findByPersonalIdWithDetails(@Param("personalId") Long personalId);

    /**
     * Găsește proiectele pentru o educație specifică
     */
    @Query("SELECT cp FROM CourseProject cp " +
            "LEFT JOIN FETCH cp.project p " +
            "LEFT JOIN FETCH cp.course c " +
            "WHERE c.education.id = :educationId " +
            "ORDER BY c.title ASC, p.title ASC")
    List<CourseProject> findByEducationIdWithDetails(@Param("educationId") Long educationId);

    /**
     * Găsește proiectele pentru un curs specific
     */
    @Query("SELECT cp FROM CourseProject cp " +
            "LEFT JOIN FETCH cp.project p " +
            "WHERE cp.course.id = :courseId " +
            "ORDER BY p.title ASC")
    List<CourseProject> findByCourseIdWithProject(@Param("courseId") Long courseId);

    /**
     * Numără proiectele academice pentru o persoană
     */
    @Query("SELECT COUNT(cp) FROM CourseProject cp " +
            "JOIN cp.course c " +
            "JOIN c.education e " +
            "WHERE e.personal.id = :personalId")
    Long countAcademicProjectsByPersonalId(@Param("personalId") Long personalId);

    /**
     * Găsește proiectele academice cu nota specificată sau mai mare
     */
    @Query("SELECT cp FROM CourseProject cp " +
            "LEFT JOIN FETCH cp.project p " +
            "LEFT JOIN FETCH cp.course c " +
            "LEFT JOIN FETCH c.education e " +
            "WHERE e.personal.id = :personalId " +
            "AND (cp.grade IS NULL OR CAST(cp.grade AS float) >= :minGrade) " +
            "ORDER BY CAST(cp.grade AS float) DESC, p.title ASC")
    List<CourseProject> findByPersonalIdAndMinGrade(@Param("personalId") Long personalId,
                                                    @Param("minGrade") Double minGrade);

    /**
     * Numără cursurile distincte pentru o educație
     */
    @Query("SELECT COUNT(DISTINCT cp.course) FROM CourseProject cp " +
            "WHERE cp.course.education.id = :educationId")
    Long countCoursesByEducationId(@Param("educationId") Long educationId);

    /**
     * Alternativă dacă ai CourseRepository direct
     */
    @Query("SELECT COUNT(c) FROM Course c WHERE c.education.id = :educationId")
    Long countCoursesDirectByEducationId(@Param("educationId") Long educationId);
}