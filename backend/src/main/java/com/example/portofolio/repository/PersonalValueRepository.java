package com.example.portofolio.repository;

import com.example.portofolio.entity.PersonalValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalValueRepository extends JpaRepository<PersonalValue, Long> {

    /**
     * Find all personal values for a person with icons
     */
    @Query("SELECT pv FROM PersonalValue pv " +
            "LEFT JOIN FETCH pv.icon " +
            "WHERE pv.personal.id = :personalId " +
            "ORDER BY pv.importanceLevel DESC, pv.title ASC")
    List<PersonalValue> findByPersonalIdWithIcon(@Param("personalId") Long personalId);

    /**
     * Count personal values for a person
     */
    Long countByPersonalId(Long personalId);

}