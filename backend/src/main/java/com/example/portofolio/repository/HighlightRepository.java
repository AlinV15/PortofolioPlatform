package com.example.portofolio.repository;

import com.example.portofolio.entity.Highlight;
import com.example.portofolio.entity.enums.HighlightType;
import com.example.portofolio.entity.enums.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, Long> {

    /**
     * Găsește toate highlight-urile pentru o persoană cu iconurile
     */
    @Query("SELECT h FROM Highlight h " +
            "LEFT JOIN FETCH h.icon " +
            "WHERE h.personal.id = :personalId " +
            "ORDER BY h.priorityLevel DESC, h.createdAt DESC")
    List<Highlight> findByPersonalIdWithIcon(@Param("personalId") Long personalId);

    /**
     * Găsește highlight-uri după tip și persoană
     */
    @Query("SELECT h FROM Highlight h " +
            "LEFT JOIN FETCH h.icon " +
            "WHERE h.personal.id = :personalId AND h.highlightType = :highlightType " +
            "ORDER BY h.priorityLevel DESC")
    List<Highlight> findByPersonalIdAndType(@Param("personalId") Long personalId,
                                            @Param("highlightType") HighlightType highlightType);

    /**
     * Găsește highlight-uri după prioritate
     */
    @Query("SELECT h FROM Highlight h " +
            "WHERE h.personal.id = :personalId AND h.priorityLevel = :priorityLevel " +
            "ORDER BY h.createdAt DESC")
    List<Highlight> findByPersonalIdAndPriority(@Param("personalId") Long personalId,
                                                @Param("priorityLevel") PriorityLevel priorityLevel);

    /**
     * Numără highlight-urile pentru o persoană
     */
    Long countByPersonalId(Long personalId);

    /**
     * Găsește highlight-urile cu prioritate mare
     */
    @Query("SELECT h FROM Highlight h " +
            "WHERE h.personal.id = :personalId " +
            "AND h.priorityLevel IN ('HIGH', 'CRITICAL') " +
            "ORDER BY h.priorityLevel DESC, h.createdAt DESC")
    List<Highlight> findHighPriorityByPersonalId(@Param("personalId") Long personalId);
}
