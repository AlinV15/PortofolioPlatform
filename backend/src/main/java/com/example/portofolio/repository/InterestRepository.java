package com.example.portofolio.repository;

import com.example.portofolio.entity.Interest;
import com.example.portofolio.entity.enums.IntensityLevel;
import com.example.portofolio.entity.enums.InterestCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {

    // Basic queries
    List<Interest> findByPersonalId(Long personalId);

    List<Interest> findByPersonalIdAndCategory(Long personalId, InterestCategory category);

    List<Interest> findByPersonalIdAndIntensity(Long personalId, IntensityLevel intensity);

    // Optimized queries
    @Query("SELECT i FROM Interest i " +
            "LEFT JOIN FETCH i.recentDiscoveries " +
            "WHERE i.personal.id = :personalId")
    List<Interest> findByPersonalIdWithDiscoveries(@Param("personalId") Long personalId);

    // Featured interests
    @Query("SELECT i FROM Interest i " +
            "JOIN EntityMetadata em ON em.entityType = 'INTEREST' AND em.entityId = i.id " +
            "WHERE i.personal.id = :personalId AND em.featured = true " +
            "ORDER BY i.intensity DESC")
    List<Interest> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    // High intensity interests
    @Query("SELECT i FROM Interest i " +
            "WHERE i.personal.id = :personalId " +
            "AND i.intensity = 'PASSIONATE' " +
            "ORDER BY i.createdAt DESC")
    List<Interest> findPassionateInterestsByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(i) FROM Interest i WHERE i.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT i.category, COUNT(i) FROM Interest i " +
            "WHERE i.personal.id = :personalId " +
            "GROUP BY i.category " +
            "ORDER BY COUNT(i) DESC")
    List<Object[]> countInterestsByCategory(@Param("personalId") Long personalId);

    @Query("SELECT i.intensity, COUNT(i) FROM Interest i " +
            "WHERE i.personal.id = :personalId " +
            "GROUP BY i.intensity " +
            "ORDER BY i.intensity DESC")
    List<Object[]> countInterestsByIntensity(@Param("personalId") Long personalId);

    // Search
    @Query("SELECT i FROM Interest i " +
            "WHERE i.personal.id = :personalId " +
            "AND (LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(i.whyInterested) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Interest> findByPersonalIdAndSearchTerm(@Param("personalId") Long personalId,
                                                 @Param("search") String search);
}
