package com.example.portofolio.repository;

import com.example.portofolio.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByEducationId(Long educationId);

    List<Course> findByEducationIdAndRelevantTrue(Long educationId);

    List<Course> findByEducationIdOrderByYearDescSemesterDesc(Long educationId);

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.courseProjects " +
            "WHERE c.education.id = :educationId")
    List<Course> findByEducationIdWithProjects(@Param("educationId") Long educationId);

    @Query("SELECT c FROM Course c " +
            "WHERE c.education.personal.id = :personalId")
    List<Course> findByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT c FROM Course c " +
            "WHERE c.education.personal.id = :personalId AND c.relevant = true")
    List<Course> findRelevantByPersonalId(@Param("personalId") Long personalId);

    List<Course> findByEducationIdAndYear(Long educationId, Integer year);

    @Query("SELECT c FROM Course c " +
            "WHERE c.education.id = :educationId " +
            "AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Course> findByEducationIdAndSearchTerm(@Param("educationId") Long educationId,
                                                @Param("search") String search);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.education.id = :educationId")
    Long countByEducationId(@Param("educationId") Long educationId);
}
