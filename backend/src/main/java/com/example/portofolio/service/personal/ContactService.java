package com.example.portofolio.service.personal;

import com.example.portofolio.dto.*;
import com.example.portofolio.entity.*;
import com.example.portofolio.entity.enums.*;
import com.example.portofolio.repository.*;
import com.example.portofolio.service.base.BaseService;
import com.example.portofolio.service.base.ServiceUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Contact Service with ServiceUtils
 */
@Service
@Slf4j
public class ContactService extends BaseService<ContactInfo, Long, ContactInfoRepository> {

    private final ContactLocationRepository contactLocationRepository;

    @Autowired
    public ContactService(ContactInfoRepository contactInfoRepository,
                          ContactLocationRepository contactLocationRepository) {
        super(contactInfoRepository);
        this.contactLocationRepository = contactLocationRepository;
    }

    @Override
    protected String getEntityTypeName() {
        return EntityType.CONTACT_INFO.name();
    }

    @Override
    protected ContactInfoDto toDto(ContactInfo contactInfo) {
        return toContactInfoDto(contactInfo);
    }

    // ===== CORE CONTACT QUERIES (folosind metodele exacte din repository) =====

    @Cacheable(value = "contactByPersonal", key = "#personalId")
    public Optional<ContactInfoDto> findByPersonalId(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalId", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Optional<ContactInfo> contactInfo = repository.findByPersonalId(personalId);
        Optional<ContactInfoDto> result = contactInfo.map(this::toContactInfoDto);

        ServiceUtils.logMethodExit("findByPersonalId", result.isPresent() ? 1 : 0);
        return result;
    }

    @Cacheable(value = "contactWithLocation", key = "#personalId")
    public Optional<ContactInfoDto> findByPersonalIdWithLocation(@Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("findByPersonalIdWithLocation", personalId);
        ServiceUtils.validatePersonalId(personalId);

        Optional<ContactInfo> contactInfo = repository.findByPersonalIdWithLocation(personalId);
        Optional<ContactInfoDto> result = contactInfo.map(this::toContactInfoDtoWithLocation);

        ServiceUtils.logMethodExit("findByPersonalIdWithLocation", result.isPresent() ? 1 : 0);
        return result;
    }

    public Optional<ContactInfoDto> findByEmail(@Valid @NotNull String email) {
        ServiceUtils.logMethodEntry("findByEmail", email);
        validateEmail(email);

        Optional<ContactInfo> contactInfo = repository.findByEmail(email);
        Optional<ContactInfoDto> result = contactInfo.map(this::toContactInfoDto);

        ServiceUtils.logMethodExit("findByEmail", result.isPresent() ? 1 : 0);
        return result;
    }

    public Optional<ContactInfoDto> findByIdWithPersonalAndLocation(@Valid @NotNull @Positive Long id) {
        ServiceUtils.logMethodEntry("findByIdWithPersonalAndLocation", id);
        ServiceUtils.validateEntityId(id);

        Optional<ContactInfo> contactInfo = repository.findByIdWithPersonalAndLocation(id);
        Optional<ContactInfoDto> result = contactInfo.map(this::toContactInfoDtoWithLocation);

        ServiceUtils.logMethodExit("findByIdWithPersonalAndLocation", result.isPresent() ? 1 : 0);
        return result;
    }

    // ===== SOCIAL MEDIA QUERIES (folosind metodele exacte) =====

    @Cacheable(value = "contactsWithGithub")
    public List<ContactInfoDto> findAllWithGithub() {
        ServiceUtils.logMethodEntry("findAllWithGithub");

        List<ContactInfo> contacts = repository.findAllWithGithub();
        List<ContactInfoDto> result = contacts.stream()
                .map(this::toContactInfoDto)
                .toList();

        ServiceUtils.logMethodExit("findAllWithGithub", result.size());
        return result;
    }

    @Cacheable(value = "contactsWithLinkedin")
    public List<ContactInfoDto> findAllWithLinkedin() {
        ServiceUtils.logMethodEntry("findAllWithLinkedin");

        List<ContactInfo> contacts = repository.findAllWithLinkedin();
        List<ContactInfoDto> result = contacts.stream()
                .map(this::toContactInfoDto)
                .toList();

        ServiceUtils.logMethodExit("findAllWithLinkedin", result.size());
        return result;
    }

    @Cacheable(value = "contactsWithWebsite")
    public List<ContactInfoDto> findAllWithWebsite() {
        ServiceUtils.logMethodEntry("findAllWithWebsite");

        List<ContactInfo> contacts = repository.findAllWithWebsite();
        List<ContactInfoDto> result = contacts.stream()
                .map(this::toContactInfoDto)
                .toList();

        ServiceUtils.logMethodExit("findAllWithWebsite", result.size());
        return result;
    }

    // ===== SEARCH METHODS (folosind metodele exacte) =====

    public List<ContactInfoDto> searchByEmailOrPhone(@Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchByEmailOrPhone", searchTerm);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<ContactInfo> contacts = repository.findByEmailOrPhoneContaining(searchTerm);
        List<ContactInfoDto> result = contacts.stream()
                .map(this::toContactInfoDto)
                .toList();

        ServiceUtils.logMethodExit("searchByEmailOrPhone", result.size());
        return result;
    }

    // ===== VALIDATION METHODS (folosind metodele exacte) =====

    public boolean existsByEmail(@Valid @NotNull String email) {
        ServiceUtils.logMethodEntry("existsByEmail", email);
        validateEmail(email);

        boolean exists = repository.existsByEmail(email);
        ServiceUtils.logMethodExit("existsByEmail", exists);
        return exists;
    }

    public boolean isEmailUniqueForPersonal(@Valid @NotNull String email,
                                            @Valid @NotNull @Positive Long personalId) {
        ServiceUtils.logMethodEntry("isEmailUniqueForPersonal", email, personalId);
        validateEmail(email);
        ServiceUtils.validatePersonalId(personalId);

        boolean isUnique = !repository.existsByEmailAndPersonalIdNot(email, personalId);
        ServiceUtils.logMethodExit("isEmailUniqueForPersonal", isUnique);
        return isUnique;
    }

    public boolean existsByPhone(@Valid @NotNull String phone) {
        ServiceUtils.logMethodEntry("existsByPhone", phone);
        validatePhone(phone);

        boolean exists = repository.existsByPhone(phone);
        ServiceUtils.logMethodExit("existsByPhone", exists);
        return exists;
    }

    public boolean existsByGithub(@Valid @NotNull String github) {
        ServiceUtils.logMethodEntry("existsByGithub", github);
        validateSocialLink(github);

        boolean exists = repository.existsByGithub(github);
        ServiceUtils.logMethodExit("existsByGithub", exists);
        return exists;
    }

    public boolean existsByLinkedin(@Valid @NotNull String linkedin) {
        ServiceUtils.logMethodEntry("existsByLinkedin", linkedin);
        validateSocialLink(linkedin);

        boolean exists = repository.existsByLinkedin(linkedin);
        ServiceUtils.logMethodExit("existsByLinkedin", exists);
        return exists;
    }

    // ===== STATISTICS METHODS (folosind metodele exacte) =====

    @Cacheable(value = "contactStats")
    public ContactStatisticsDto getContactStatistics() {
        ServiceUtils.logMethodEntry("getContactStatistics");

        Long totalWithEmail = repository.countWithEmail();
        Long totalWithPhone = repository.countWithPhone();
        Long totalWithGithub = repository.countWithGithub();
        Long totalWithLinkedin = repository.countWithLinkedin();

        // Get location statistics
        Map<String, Long> countryStats = getLocationStatsByCountry();
        Map<String, Long> cityStats = getLocationStatsByCity();
        List<String> timezones = getAllTimezones();

        ContactStatisticsDto result = ContactStatisticsDto.builder()
                .totalWithEmail(totalWithEmail)
                .totalWithPhone(totalWithPhone)
                .totalWithGithub(totalWithGithub)
                .totalWithLinkedin(totalWithLinkedin)
                .countryDistribution(countryStats)
                .cityDistribution(cityStats)
                .availableTimezones(timezones)
                .build();

        ServiceUtils.logMethodExit("getContactStatistics", result);
        return result;
    }

    // ===== LOCATION METHODS (folosind ContactLocationRepository) =====

    public Optional<ContactLocationDto> findLocationByContactInfoId(@Valid @NotNull @Positive Long contactInfoId) {
        ServiceUtils.logMethodEntry("findLocationByContactInfoId", contactInfoId);
        ServiceUtils.validateEntityId(contactInfoId);

        Optional<ContactLocation> location = contactLocationRepository.findByContactInfoId(contactInfoId);
        Optional<ContactLocationDto> result = location.map(this::toContactLocationDto);

        ServiceUtils.logMethodExit("findLocationByContactInfoId", result.isPresent() ? 1 : 0);
        return result;
    }

    public List<ContactLocationDto> findLocationsByCity(@Valid @NotNull String city) {
        ServiceUtils.logMethodEntry("findLocationsByCity", city);
        validateLocationParam(city);

        List<ContactLocation> locations = contactLocationRepository.findByCity(city);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("findLocationsByCity", result.size());
        return result;
    }

    public List<ContactLocationDto> findLocationsByCountry(@Valid @NotNull String country) {
        ServiceUtils.logMethodEntry("findLocationsByCountry", country);
        validateLocationParam(country);

        List<ContactLocation> locations = contactLocationRepository.findByCountry(country);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("findLocationsByCountry", result.size());
        return result;
    }

    public List<ContactLocationDto> findLocationsByCityAndCountry(@Valid @NotNull String city,
                                                                  @Valid @NotNull String country) {
        ServiceUtils.logMethodEntry("findLocationsByCityAndCountry", city, country);
        validateLocationParam(city);
        validateLocationParam(country);

        List<ContactLocation> locations = contactLocationRepository.findByCityAndCountry(city, country);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("findLocationsByCityAndCountry", result.size());
        return result;
    }

    public List<ContactLocationDto> findLocationsByCoordinatesBounds(@Valid @NotNull BigDecimal minLat,
                                                                     @Valid @NotNull BigDecimal maxLat,
                                                                     @Valid @NotNull BigDecimal minLng,
                                                                     @Valid @NotNull BigDecimal maxLng) {
        ServiceUtils.logMethodEntry("findLocationsByCoordinatesBounds", minLat, maxLat, minLng, maxLng);
        validateCoordinates(minLat, maxLat, minLng, maxLng);

        List<ContactLocation> locations = contactLocationRepository.findByCoordinatesBounds(minLat, maxLat, minLng, maxLng);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("findLocationsByCoordinatesBounds", result.size());
        return result;
    }

    public List<ContactLocationDto> findLocationsByTimezone(@Valid @NotNull String timezone) {
        ServiceUtils.logMethodEntry("findLocationsByTimezone", timezone);
        validateTimezone(timezone);

        List<ContactLocation> locations = contactLocationRepository.findByTimezone(timezone);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("findLocationsByTimezone", result.size());
        return result;
    }

    @Cacheable(value = "allTimezones")
    public List<String> getAllTimezones() {
        ServiceUtils.logMethodEntry("getAllTimezones");

        List<String> timezones = contactLocationRepository.findAllTimezones();

        ServiceUtils.logMethodExit("getAllTimezones", timezones.size());
        return timezones;
    }

    public List<ContactLocationDto> searchLocations(@Valid @NotNull String searchTerm) {
        ServiceUtils.logMethodEntry("searchLocations", searchTerm);
        ServiceUtils.validateSearchTerm(searchTerm);

        List<ContactLocation> locations = contactLocationRepository.findBySearchTerm(searchTerm);
        List<ContactLocationDto> result = locations.stream()
                .map(this::toContactLocationDto)
                .toList();

        ServiceUtils.logMethodExit("searchLocations", result.size());
        return result;
    }

    // ===== LOCATION STATISTICS (folosind metodele exacte) =====

    @Cacheable(value = "locationStatsByCountry")
    public Map<String, Long> getLocationStatsByCountry() {
        ServiceUtils.logMethodEntry("getLocationStatsByCountry");

        List<Object[]> results = contactLocationRepository.countLocationsByCountry();
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> (String) row[0],
                row -> ((Number) row[1]).longValue()
        ));

        ServiceUtils.logMethodExit("getLocationStatsByCountry", stats.size());
        return stats;
    }

    @Cacheable(value = "locationStatsByCity")
    public Map<String, Long> getLocationStatsByCity() {
        ServiceUtils.logMethodEntry("getLocationStatsByCity");

        List<Object[]> results = contactLocationRepository.countLocationsByCity();
        Map<String, Long> stats = results.stream().collect(Collectors.toMap(
                row -> {
                    String city = (String) row[0];
                    String country = (String) row[1];
                    return city + ", " + country;
                },
                row -> ((Number) row[2]).longValue()
        ));

        ServiceUtils.logMethodExit("getLocationStatsByCity", stats.size());
        return stats;
    }

    // ===== DTO CONVERSION =====

    private ContactInfoDto toContactInfoDto(ContactInfo contactInfo) {
        String location = null;
        if (contactInfo.getContactLocation() != null) {
            ContactLocation loc = contactInfo.getContactLocation();
            location = formatLocation(loc.getCity(), loc.getCountry());
        }

        return ContactInfoDto.builder()
                .email(contactInfo.getEmail())
                .phone(contactInfo.getPhone())
                .location(location)
                .github(contactInfo.getGithub())
                .linkedin(contactInfo.getLinkedin())
                .build();
    }

    private ContactInfoDto toContactInfoDtoWithLocation(ContactInfo contactInfo) {
        return ContactInfoDto.builder()
                .email(contactInfo.getEmail())
                .phone(contactInfo.getPhone())
                .location(formatLocationDetailed(contactInfo.getContactLocation()))
                .github(contactInfo.getGithub())
                .linkedin(contactInfo.getLinkedin())
                .build();
    }

    private ContactLocationDto toContactLocationDto(ContactLocation location) {
        ContactLocationDto.CoordinatesDto coordinates = null;
        if (location.getLatitude() != null && location.getLongitude() != null) {
            coordinates = ContactLocationDto.CoordinatesDto.builder()
                    .lat(location.getLatitude().doubleValue())
                    .lng(location.getLongitude().doubleValue())
                    .build();
        }

        return ContactLocationDto.builder()
                .name(location.getName())
                .address(location.getAddress())
                .city(location.getCity())
                .country(location.getCountry())
                .coordinates(coordinates)
                .timezone(location.getTimezone())
                .workingHours(location.getWorkingHours())
                .build();
    }

    // ===== HELPER METHODS =====

    private String formatLocation(String city, String country) {
        if (city != null && country != null) {
            return city + ", " + country;
        }
        if (city != null) return city;
        if (country != null) return country;
        return null;
    }

    private String formatLocationDetailed(ContactLocation location) {
        if (location == null) return null;

        StringBuilder sb = new StringBuilder();
        if (location.getName() != null) {
            sb.append(location.getName());
        }
        if (location.getCity() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(location.getCity());
        }
        if (location.getCountry() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(location.getCountry());
        }

        return sb.length() > 0 ? sb.toString() : null;
    }

    // ===== VALIDATION HELPERS =====

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private void validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone cannot be empty");
        }
    }

    private void validateSocialLink(String link) {
        if (link == null || link.trim().isEmpty()) {
            throw new IllegalArgumentException("Social link cannot be empty");
        }
    }

    private void validateLocationParam(String param) {
        if (param == null || param.trim().isEmpty()) {
            throw new IllegalArgumentException("Location parameter cannot be empty");
        }
    }

    private void validateTimezone(String timezone) {
        if (timezone == null || timezone.trim().isEmpty()) {
            throw new IllegalArgumentException("Timezone cannot be empty");
        }
    }

    private void validateCoordinates(BigDecimal minLat, BigDecimal maxLat,
                                     BigDecimal minLng, BigDecimal maxLng) {
        if (minLat == null || maxLat == null || minLng == null || maxLng == null) {
            throw new IllegalArgumentException("All coordinates must be provided");
        }
        if (minLat.compareTo(maxLat) >= 0) {
            throw new IllegalArgumentException("minLat must be less than maxLat");
        }
        if (minLng.compareTo(maxLng) >= 0) {
            throw new IllegalArgumentException("minLng must be less than maxLng");
        }
    }

    // ===== METADATA SUPPORT =====

    @Override
    public List<ContactInfo> findFeatured() {
        // Contact info doesn't have featured concept
        return List.of();
    }

    @Override
    public boolean hasMetadata(Long id) {
        return false; // Contact info doesn't use EntityMetadata
    }
}

// ===== SUPPORTING CLASSES =====

@lombok.Data
@lombok.Builder
class ContactStatisticsDto {
    private Long totalWithEmail;
    private Long totalWithPhone;
    private Long totalWithGithub;
    private Long totalWithLinkedin;
    private Map<String, Long> countryDistribution;
    private Map<String, Long> cityDistribution;
    private List<String> availableTimezones;

    public Double getSocialMediaCoverage() {
        Long totalSocial = totalWithGithub + totalWithLinkedin;
        Long totalContacts = Math.max(totalWithEmail, 1L); // Avoid division by zero
        return ServiceUtils.calculatePercentage(totalSocial, totalContacts);
    }

    public String getMostCommonCountry() {
        return ServiceUtils.findMostFrequent(
                countryDistribution.entrySet().stream()
                        .map(Map.Entry::getKey)
                        .toList()
        ).orElse("Unknown");
    }

    public Boolean hasInternationalPresence() {
        return countryDistribution.size() > 1;
    }
}