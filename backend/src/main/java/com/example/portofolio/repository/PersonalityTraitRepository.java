// PersonalityTraitRepository
package com.example.portofolio.repository;

import com.example.portofolio.entity.PersonalityTrait;
import com.example.portofolio.entity.enums.StrengthLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalityTraitRepository extends JpaRepository<PersonalityTrait, Long> {

    /**
     * Găsește toate trăsăturile de personalitate pentru o persoană cu iconul și exemplele
     */
    @Query("SELECT pt FROM PersonalityTrait pt " +
            "LEFT JOIN FETCH pt.icon " +
            "LEFT JOIN FETCH pt.examples " +
            "WHERE pt.personal.id = :personalId " +
            "ORDER BY pt.strengthLevel DESC, pt.trait ASC")
    List<PersonalityTrait> findByPersonalIdWithIconAndExamples(@Param("personalId") Long personalId);

    /**
     * Găsește trăsăturile după nivel de putere
     */
    @Query("SELECT pt FROM PersonalityTrait pt " +
            "LEFT JOIN FETCH pt.icon " +
            "LEFT JOIN FETCH pt.examples " +
            "WHERE pt.personal.id = :personalId AND pt.strengthLevel = :strengthLevel " +
            "ORDER BY pt.trait ASC")
    List<PersonalityTrait> findByPersonalIdAndStrengthLevel(@Param("personalId") Long personalId,
                                                            @Param("strengthLevel") StrengthLevel strengthLevel);

    /**
     * Găsește trăsăturile puternice (HIGH și DOMINANT)
     */
    @Query("SELECT pt FROM PersonalityTrait pt " +
            "LEFT JOIN FETCH pt.icon " +
            "LEFT JOIN FETCH pt.examples " +
            "WHERE pt.personal.id = :personalId " +
            "AND pt.strengthLevel IN ('HIGH', 'DOMINANT') " +
            "ORDER BY pt.strengthLevel DESC, pt.trait ASC")
    List<PersonalityTrait> findStrongTraitsByPersonalId(@Param("personalId") Long personalId);

    /**
     * Numără trăsăturile pentru o persoană
     */
    Long countByPersonalId(Long personalId);

    /**
     * Căutare în trăsăturile de personalitate
     */
    @Query("SELECT pt FROM PersonalityTrait pt " +
            "LEFT JOIN FETCH pt.icon " +
            "WHERE pt.personal.id = :personalId " +
            "AND (LOWER(pt.trait) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(pt.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<PersonalityTrait> searchByPersonalIdAndTerm(@Param("personalId") Long personalId,
                                                     @Param("search") String search);
}