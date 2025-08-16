package com.example.portofolio.repository;

import com.example.portofolio.entity.ContactLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContactLocationRepository extends JpaRepository<ContactLocation, Long> {

    // Basic queries
    Optional<ContactLocation> findByContactInfoId(Long contactInfoId);

    List<ContactLocation> findByCity(String city);

    List<ContactLocation> findByCountry(String country);

    List<ContactLocation> findByCityAndCountry(String city, String country);

    // Geographic queries
    @Query("SELECT cl FROM ContactLocation cl " +
            "WHERE cl.latitude BETWEEN :minLat AND :maxLat " +
            "AND cl.longitude BETWEEN :minLng AND :maxLng")
    List<ContactLocation> findByCoordinatesBounds(@Param("minLat") BigDecimal minLatitude,
                                                  @Param("maxLat") BigDecimal maxLatitude,
                                                  @Param("minLng") BigDecimal minLongitude,
                                                  @Param("maxLng") BigDecimal maxLongitude);

    // Timezone queries
    List<ContactLocation> findByTimezone(String timezone);

    @Query("SELECT DISTINCT cl.timezone FROM ContactLocation cl " +
            "WHERE cl.timezone IS NOT NULL " +
            "ORDER BY cl.timezone")
    List<String> findAllTimezones();

    // Statistics
    @Query("SELECT cl.country, COUNT(cl) FROM ContactLocation cl " +
            "GROUP BY cl.country " +
            "ORDER BY COUNT(cl) DESC")
    List<Object[]> countLocationsByCountry();

    @Query("SELECT cl.city, cl.country, COUNT(cl) FROM ContactLocation cl " +
            "GROUP BY cl.city, cl.country " +
            "ORDER BY COUNT(cl) DESC")
    List<Object[]> countLocationsByCity();

    // Search
    @Query("SELECT cl FROM ContactLocation cl " +
            "WHERE LOWER(cl.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(cl.city) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(cl.country) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(cl.address) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<ContactLocation> findBySearchTerm(@Param("search") String search);
}