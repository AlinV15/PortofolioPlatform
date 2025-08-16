package com.example.portofolio.repository;

import com.example.portofolio.entity.Hobby;
import com.example.portofolio.entity.enums.HobbyCategory;
import com.example.portofolio.entity.enums.ActivityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {

    // Basic queries
    List<Hobby> findByPersonalId(Long personalId);

    List<Hobby> findByPersonalIdAndCategory(Long personalId, HobbyCategory category);

    List<Hobby> findByPersonalIdAndActivityLevel(Long personalId, ActivityLevel activityLevel);

    List<Hobby> findByPersonalIdOrderByYearsActiveDesc(Long personalId);

    // Featured hobbies
    @Query("SELECT h FROM Hobby h " +
            "JOIN EntityMetadata em ON em.entityType = 'HOBBY' AND em.entityId = h.id " +
            "WHERE h.personal.id = :personalId AND em.featured = true " +
            "ORDER BY h.yearsActive DESC")
    List<Hobby> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // Activity level queries
    @Query("SELECT h FROM Hobby h " +
            "WHERE h.personal.id = :personalId " +
            "AND h.activityLevel IN ('FREQUENT', 'DAILY') " +
            "ORDER BY h.activityLevel DESC, h.yearsActive DESC")
    List<Hobby> findActiveHobbiesByPersonalId(@Param("personalId") Long personalId);

    // Years active queries
    @Query("SELECT h FROM Hobby h " +
            "WHERE h.personal.id = :personalId " +
            "AND h.yearsActive >= :minYears " +
            "ORDER BY h.yearsActive DESC")
    List<Hobby> findByPersonalIdAndMinYearsActive(@Param("personalId") Long personalId,
                                                  @Param("minYears") BigDecimal minYears);

    // Statistics
    @Query("SELECT COUNT(h) FROM Hobby h WHERE h.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT h.category, COUNT(h) FROM Hobby h " +
            "WHERE h.personal.id = :personalId " +
            "GROUP BY h.category " +
            "ORDER BY COUNT(h) DESC")
    List<Object[]> countHobbiesByCategory(@Param("personalId") Long personalId);

    @Query("SELECT AVG(h.yearsActive) FROM Hobby h " +
            "WHERE h.personal.id = :personalId")
    BigDecimal findAverageYearsActiveByPersonalId(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT h FROM Hobby h " +
            "WHERE h.personal.id = :personalId " +
            "AND (LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(h.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Hobby> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                              @Param("search") String search);
}