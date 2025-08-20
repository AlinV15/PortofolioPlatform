package com.example.portofolio.repository;

import com.example.portofolio.entity.PersonalityTrait;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalityTraitRepository extends JpaRepository<PersonalityTrait, Long> {

    /**
     * Find all the personality traits for a person with the icon and examples
     */
    @Query("SELECT pt FROM PersonalityTrait pt " +
            "LEFT JOIN FETCH pt.icon " +
            "LEFT JOIN FETCH pt.examples " +
            "WHERE pt.personal.id = :personalId " +
            "ORDER BY pt.strengthLevel DESC, pt.trait ASC")
    List<PersonalityTrait> findByPersonalIdWithIconAndExamples(@Param("personalId") Long personalId);

    /**
     * Count the features for a person
     */
    Long countByPersonalId(Long personalId);

}