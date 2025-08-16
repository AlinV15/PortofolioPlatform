package com.example.portofolio.repository;

import com.example.portofolio.entity.PersonalValue;
import com.example.portofolio.entity.enums.ImportanceLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalValueRepository extends JpaRepository<PersonalValue, Long> {

    /**
     * Găsește toate valorile personale pentru o persoană cu iconurile
     */
    @Query("SELECT pv FROM PersonalValue pv " +
            "LEFT JOIN FETCH pv.icon " +
            "WHERE pv.personal.id = :personalId " +
            "ORDER BY pv.importanceLevel DESC, pv.title ASC")
    List<PersonalValue> findByPersonalIdWithIcon(@Param("personalId") Long personalId);

    /**
     * Găsește valori după nivel de importanță
     */
    @Query("SELECT pv FROM PersonalValue pv " +
            "WHERE pv.personal.id = :personalId AND pv.importanceLevel = :importanceLevel " +
            "ORDER BY pv.title ASC")
    List<PersonalValue> findByPersonalIdAndImportanceLevel(@Param("personalId") Long personalId,
                                                           @Param("importanceLevel") ImportanceLevel importanceLevel);

    /**
     * Găsește valorile cu importanță mare
     */
    @Query("SELECT pv FROM PersonalValue pv " +
            "WHERE pv.personal.id = :personalId " +
            "AND pv.importanceLevel IN ('HIGH', 'CRITICAL') " +
            "ORDER BY pv.importanceLevel DESC, pv.title ASC")
    List<PersonalValue> findTopValuesByPersonalId(@Param("personalId") Long personalId);

    /**
     * Numără valorile personale pentru o persoană
     */
    Long countByPersonalId(Long personalId);

    /**
     * Căutare în valorile personale
     */
    @Query("SELECT pv FROM PersonalValue pv " +
            "WHERE pv.personal.id = :personalId " +
            "AND (LOWER(pv.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(pv.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<PersonalValue> searchByPersonalIdAndTerm(@Param("personalId") Long personalId,
                                                  @Param("search") String search);
}