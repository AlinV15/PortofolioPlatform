package com.example.portofolio.repository;

import com.example.portofolio.entity.Highlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, Long> {

    /**
     * Find all the highlights for a person with icons
     */
    @Query("SELECT h FROM Highlight h " +
            "LEFT JOIN FETCH h.icon " +
            "WHERE h.personal.id = :personalId " +
            "ORDER BY h.priorityLevel DESC, h.createdAt DESC")
    List<Highlight> findByPersonalIdWithIcon(@Param("personalId") Long personalId);

    /**
     * Count the highlights for one person
     */
    Long countByPersonalId(Long personalId);

}
