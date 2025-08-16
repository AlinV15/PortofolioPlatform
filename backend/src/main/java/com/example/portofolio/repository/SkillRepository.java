package com.example.portofolio.repository;

import com.example.portofolio.entity.Skill;
import com.example.portofolio.entity.enums.ProficiencyLevel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    // Basic queries
    List<Skill> findByPersonalId(Long personalId);

    List<Skill> findByPersonalIdAndCategoryId(Long personalId, Long categoryId);

    List<Skill> findByPersonalIdOrderByLevelDesc(Long personalId);

    // Optimized queries cu JOIN FETCH
    @Query("SELECT s FROM Skill s " +
            "LEFT JOIN FETCH s.category " +
            "LEFT JOIN FETCH s.tags " +
            "WHERE s.personal.id = :personalId")
    List<Skill> findByPersonalIdWithCategoryAndTags(@Param("personalId") Long personalId);

    @Query("SELECT s FROM Skill s " +
            "LEFT JOIN FETCH s.category " +
            "WHERE s.personal.id = :personalId AND s.category.id = :categoryId")
    List<Skill> findByPersonalIdAndCategoryIdWithCategory(@Param("personalId") Long personalId,
                                                          @Param("categoryId") Long categoryId);

    // Top skills queries
    @Query("SELECT s FROM Skill s " +
            "WHERE s.personal.id = :personalId " +
            "ORDER BY s.level DESC")
    List<Skill> findTopSkillsByPersonalId(@Param("personalId") Long personalId, Pageable pageable);

    // Featured/Trending skills
    @Query("SELECT s FROM Skill s " +
            "JOIN EntityMetadata em ON em.entityType = 'SKILL' AND em.entityId = s.id " +
            "WHERE s.personal.id = :personalId AND em.featured = true")
    List<Skill> findFeaturedByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT s FROM Skill s " +
            "WHERE s.personal.id = :personalId AND s.trending = true " +
            "ORDER BY s.level DESC")
    List<Skill> findTrendingByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT s FROM Skill s " +
            "WHERE s.personal.id = :personalId AND s.learning = true")
    List<Skill> findCurrentlyLearningByPersonalId(@Param("personalId") Long personalId);

    // Statistics
    @Query("SELECT COUNT(s) FROM Skill s WHERE s.personal.id = :personalId")
    Long countByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT AVG(s.level) FROM Skill s WHERE s.personal.id = :personalId")
    Double findAverageSkillLevelByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT COUNT(s) FROM Skill s " +
            "WHERE s.personal.id = :personalId AND s.proficiency = :proficiency")
    Long countByPersonalIdAndProficiency(@Param("personalId") Long personalId,
                                         @Param("proficiency") ProficiencyLevel proficiency);

    // Search and filtering
    @Query("SELECT s FROM Skill s " +
            "WHERE s.personal.id = :personalId " +
            "AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Skill> findByPersonalIdAndNameOrDescriptionContaining(@Param("personalId") Long personalId,
                                                               @Param("search") String search);

    @Query("SELECT s FROM Skill s " +
            "WHERE s.personal.id = :personalId " +
            "AND s.level >= :minLevel AND s.level <= :maxLevel")
    List<Skill> findByPersonalIdAndLevelBetween(@Param("personalId") Long personalId,
                                                @Param("minLevel") Integer minLevel,
                                                @Param("maxLevel") Integer maxLevel);



    @Query("SELECT s FROM Skill s JOIN EntityMetadata em ON em.entityType = 'SKILL' AND em.entityId = s.id " +
            "WHERE s.personal.id = :personalId AND em.featured = true ORDER BY s.level DESC")
    List<Skill> findFeaturedByPersonalId(@Param("personalId") Long personalId, Pageable pageable);

    /**
     * Return top skills ordered after level  (descendant) and limited for N skills
     * Use LEFT JOIN for including metadata (color)
     */
    @Query("SELECT s, em FROM Skill s " +
            "LEFT JOIN EntityMetadata em ON em.entityType = 'SKILL' AND em.entityId = s.id " +
            "WHERE s.personal.id = :personalId AND s.level IS NOT NULL " +
            "ORDER BY s.level DESC, s.name ASC")
    List<Object[]> findTopSkillsByLevel(@Param("personalId") Long personalId, Pageable pageable);
    // Adaugă în SkillRepository

    /**
     * Găsește skill-urile după numele categoriei
     */
    @Query("SELECT s FROM Skill s " +
            "LEFT JOIN FETCH s.category sc " +
            "WHERE s.personal.id = :personalId " +
            "AND LOWER(sc.name) LIKE LOWER(CONCAT('%', :categoryName, '%')) " +
            "ORDER BY s.level DESC")
    List<Skill> findByPersonalIdAndCategoryName(@Param("personalId") Long personalId,
                                                @Param("categoryName") String categoryName);

    /**
     * Alternativă directă pentru limbi străine
     */
    @Query("SELECT s FROM Skill s " +
            "LEFT JOIN FETCH s.category sc " +
            "WHERE s.personal.id = :personalId " +
            "AND (LOWER(sc.name) LIKE '%foreign%' " +
            "OR LOWER(sc.name) LIKE '%language%' " +
            "OR LOWER(sc.name) LIKE '%limb%') " +
            "ORDER BY s.level DESC")
    List<Skill> findForeignLanguagesByPersonalId(@Param("personalId") Long personalId);

    // Adaugă în SkillRepository

    /**
     * Găsește data celui mai vechi skill pentru calculul anilor de programare
     */
    @Query("SELECT MIN(s.createdAt) FROM Skill s WHERE s.personal.id = :personalId")
    LocalDate findOldestSkillDate(@Param("personalId") Long personalId);

    /**
     * Numără skill-urile trending
     */
    @Query("SELECT COUNT(s) FROM Skill s " +
            "WHERE s.personal.id = :personalId AND s.trending = :trending")
    Long countByPersonalIdAndTrending(@Param("personalId") Long personalId,
                                      @Param("trending") Boolean trending);

    /**
     * Numără skill-urile în învățare
     */
    @Query("SELECT COUNT(s) FROM Skill s " +
            "WHERE s.personal.id = :personalId AND s.learning = :learning")
    Long countByPersonalIdAndLearning(@Param("personalId") Long personalId,
                                      @Param("learning") Boolean learning);

}