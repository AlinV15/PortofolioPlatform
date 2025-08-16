package com.example.portofolio.repository;

import com.example.portofolio.entity.VolunteerResponsibility;
import com.example.portofolio.entity.enums.ImpactLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerResponsibilityRepository extends JpaRepository<VolunteerResponsibility, Long> {

    List<VolunteerResponsibility> findByVolunteerExperienceId(Long volunteerExperienceId);

    List<VolunteerResponsibility> findByVolunteerExperienceIdOrderBySortOrder(Long volunteerExperienceId);

    @Query("SELECT vr FROM VolunteerResponsibility vr " +
            "WHERE vr.volunteerExperience.personal.id = :personalId")
    List<VolunteerResponsibility> findByPersonalId(@Param("personalId") Long personalId);

    @Query("SELECT vr FROM VolunteerResponsibility vr " +
            "WHERE vr.volunteerExperience.id = :experienceId " +
            "AND vr.impactLevel = :impactLevel " +
            "ORDER BY vr.sortOrder")
    List<VolunteerResponsibility> findByExperienceIdAndImpactLevel(@Param("experienceId") Long experienceId,
                                                                   @Param("impactLevel") ImpactLevel impactLevel);
}
