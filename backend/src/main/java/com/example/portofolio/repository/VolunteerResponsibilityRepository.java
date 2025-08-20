package com.example.portofolio.repository;

import com.example.portofolio.entity.VolunteerResponsibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerResponsibilityRepository extends JpaRepository<VolunteerResponsibility, Long> {

    @Query("SELECT vr FROM VolunteerResponsibility vr " +
            "WHERE vr.volunteerExperience.personal.id = :personalId")
    List<VolunteerResponsibility> findByPersonalId(@Param("personalId") Long personalId);

}
