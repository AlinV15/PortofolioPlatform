package com.example.portofolio.repository;

import com.example.portofolio.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByEducationIdAndRelevantTrue(Long educationId);

    @Query("SELECT c FROM Course c " +
            "WHERE c.education.personal.id = :personalId")
    List<Course> findByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.education.id = :educationId")
    Long countByEducationId(@Param("educationId") Long educationId);
}
