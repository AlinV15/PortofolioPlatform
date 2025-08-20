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
     * Find all academic projects for a person through courses and education
     */
    @Query("SELECT cp FROM CourseProject cp " +
            "LEFT JOIN FETCH cp.project p " +
            "LEFT JOIN FETCH cp.course c " +
            "LEFT JOIN FETCH c.education e " +
            "WHERE e.personal.id = :personalId " +
            "ORDER BY e.startDate DESC, c.title ASC, p.title ASC")
    List<CourseProject> findByPersonalIdWithDetails(@Param("personalId") Long personalId);

}