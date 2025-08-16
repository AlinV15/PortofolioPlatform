package com.example.portofolio.service.base;

import com.example.portofolio.entity.EntityMetadata;
import com.example.portofolio.entity.enums.EntityType;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Utility class for service layer operations
 */
@Slf4j
public class ServiceUtils {

    // ===== DATE FORMATTING UTILITIES =====

    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy");
    private static final DateTimeFormatter ISO_DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    /**
     * Format date for display (e.g., "Jan 2023")
     */
    public static String formatDateForDisplay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DEFAULT_DATE_FORMATTER);
    }

    /**
     * Format date as ISO string
     */
    public static String formatDateAsIso(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(ISO_DATE_FORMATTER);
    }

    /**
     * Format date for detailed display
     */
    public static String formatDateDetailed(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DISPLAY_DATE_FORMATTER);
    }

    /**
     * Format period between two dates
     */
    public static String formatPeriod(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            return "Date not specified";
        }

        String start = formatDateForDisplay(startDate);

        if (endDate == null) {
            return start + " - Present";
        }

        String end = formatDateForDisplay(endDate);
        return start + " - " + end;
    }

    /**
     * Calculate duration between dates in human readable format
     */
    public static String calculateDuration(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            return "Unknown duration";
        }

        LocalDate end = endDate != null ? endDate : LocalDate.now();
        long months = ChronoUnit.MONTHS.between(startDate, end);
        long years = months / 12;
        long remainingMonths = months % 12;

        if (years == 0) {
            return remainingMonths + (remainingMonths == 1 ? " month" : " months");
        } else if (remainingMonths == 0) {
            return years + (years == 1 ? " year" : " years");
        } else {
            return years + (years == 1 ? " year" : " years") +
                    " " + remainingMonths + (remainingMonths == 1 ? " month" : " months");
        }
    }

    // ===== STRING UTILITIES =====

    /**
     * Safely convert enum to lowercase string
     */
    public static String enumToLowerString(Enum<?> enumValue) {
        return enumValue != null ? enumValue.toString().toLowerCase() : null;
    }

    /**
     * Convert list of tags to clean string list
     */
    public static List<String> processTags(String tagsString) {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return List.of();
        }

        return Arrays.stream(tagsString.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Truncate text to specified length
     */
    public static String truncateText(String text, int maxLength) {
        if (text == null) {
            return null;
        }
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + "...";
    }

    /**
     * Generate short description from long text
     */
    public static String generateShortDescription(String longDescription, int maxLength) {
        if (longDescription == null || longDescription.trim().isEmpty()) {
            return null;
        }

        // Try to break at sentence boundary
        String[] sentences = longDescription.split("\\. ");
        if (sentences.length > 0 && sentences[0].length() <= maxLength) {
            return sentences[0] + (sentences.length > 1 ? "." : "");
        }

        return truncateText(longDescription, maxLength);
    }

    // ===== METADATA UTILITIES =====

    /**
     * Extract color from metadata with fallback
     */
    public static String getColorFromMetadata(Optional<EntityMetadata> metadata, String fallbackColor) {
        return metadata
                .map(EntityMetadata::getPrimaryColor)
                .orElse(fallbackColor);
    }

    /**
     * Extract icon from metadata with fallback
     */
    public static String getIconFromMetadata(Optional<EntityMetadata> metadata, String fallbackIcon) {
        return metadata
                .map(em -> em.getIcon() != null ? em.getIcon().getName() : null)
                .orElse(fallbackIcon);
    }

    /**
     * Check if entity is featured
     */
    public static Boolean isFeatured(Optional<EntityMetadata> metadata) {
        return metadata
                .map(EntityMetadata::getFeatured)
                .orElse(false);
    }

    // ===== COLLECTION UTILITIES =====

    /**
     * Group items by a key function with null safety
     */
    public static <T, K> Map<K, List<T>> safeGroupBy(List<T> items,
                                                     java.util.function.Function<T, K> keyExtractor) {
        if (items == null || items.isEmpty()) {
            return Map.of();
        }

        return items.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(keyExtractor));
    }

    /**
     * Safe map with null handling
     */
    public static <T, R> List<R> safeMap(List<T> items,
                                         java.util.function.Function<T, R> mapper) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }

        return items.stream()
                .filter(Objects::nonNull)
                .map(mapper)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Filter and map in one operation
     */
    public static <T, R> List<R> filterAndMap(List<T> items,
                                              java.util.function.Predicate<T> filter,
                                              java.util.function.Function<T, R> mapper) {
        if (items == null || items.isEmpty()) {
            return List.of();
        }

        return items.stream()
                .filter(Objects::nonNull)
                .filter(filter)
                .map(mapper)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // ===== VALIDATION UTILITIES =====

    /**
     * Validate personal ID for service operations
     */
    public static void validatePersonalId(Long personalId) {
        if (personalId == null) {
            throw new IllegalArgumentException("Personal ID cannot be null");
        }
        if (personalId <= 0) {
            throw new IllegalArgumentException("Personal ID must be positive");
        }
    }

    /**
     * Validate entity ID
     */
    public static void validateEntityId(Long entityId) {
        if (entityId == null) {
            throw new IllegalArgumentException("Entity ID cannot be null");
        }
        if (entityId <= 0) {
            throw new IllegalArgumentException("Entity ID must be positive");
        }
    }

    /**
     * Validate search term for service operations
     */
    public static void validateSearchTerm(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be null or empty");
        }
        if (searchTerm.length() < 2) {
            throw new IllegalArgumentException("Search term must be at least 2 characters");
        }
    }

    // ===== STATISTICS UTILITIES =====

    /**
     * Calculate percentage safely
     */
    public static Double calculatePercentage(Long part, Long total) {
        if (total == null || total == 0) {
            return 0.0;
        }
        if (part == null) {
            return 0.0;
        }
        return (part.doubleValue() / total.doubleValue()) * 100.0;
    }

    /**
     * Calculate average safely
     */
    public static Double calculateAverage(List<? extends Number> numbers) {
        if (numbers == null || numbers.isEmpty()) {
            return 0.0;
        }

        return numbers.stream()
                .filter(Objects::nonNull)
                .mapToDouble(Number::doubleValue)
                .average()
                .orElse(0.0);
    }

    /**
     * Find most frequent value in list
     */
    public static <T> Optional<T> findMostFrequent(List<T> items) {
        if (items == null || items.isEmpty()) {
            return Optional.empty();
        }

        return items.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        java.util.function.Function.identity(),
                        Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey);
    }

    // ===== LEVEL/PROFICIENCY UTILITIES =====

    /**
     * Convert proficiency level to numeric level
     */
    public static Integer proficiencyToLevel(String proficiency) {
        if (proficiency == null) {
            return 0;
        }

        return switch (proficiency.toLowerCase()) {
            case "beginner" -> 25;
            case "intermediate" -> 50;
            case "advanced" -> 75;
            case "expert" -> 95;
            default -> 0;
        };
    }

    /**
     * Convert numeric level to proficiency
     */
    public static String levelToProficiency(Integer level) {
        if (level == null || level < 0) {
            return "beginner";
        }
        if (level >= 90) return "expert";
        if (level >= 70) return "advanced";
        if (level >= 40) return "intermediate";
        return "beginner";
    }

    /**
     * Format experience in human readable form
     */
    public static String formatExperience(Double years) {
        if (years == null || years <= 0) {
            return "No experience";
        }
        if (years < 1) {
            int months = (int) (years * 12);
            return months + (months == 1 ? " month" : " months");
        }
        if (years == Math.floor(years)) {
            int wholeYears = years.intValue();
            return wholeYears + (wholeYears == 1 ? " year" : " years");
        }
        return String.format("%.1f years", years);
    }

    // ===== CACHE KEY UTILITIES =====

    /**
     * Generate consistent cache key
     */
    public static String generateCacheKey(String prefix, Object... params) {
        if (params == null || params.length == 0) {
            return prefix;
        }

        String paramString = Arrays.stream(params)
                .filter(Objects::nonNull)
                .map(Object::toString)
                .collect(Collectors.joining("_"));

        return prefix + "_" + paramString;
    }

    // ===== LOGGING UTILITIES =====

    /**
     * Log method entry with parameters
     */
    public static void logMethodEntry(String methodName, Object... params) {
        if (log.isDebugEnabled()) {
            String paramString = Arrays.stream(params)
                    .map(param -> param != null ? param.toString() : "null")
                    .collect(Collectors.joining(", "));
            log.debug("Entering method: {}({})", methodName, paramString);
        }
    }

    /**
     * Log method exit with result count
     */
    public static void logMethodExit(String methodName, int resultCount) {
        if (log.isDebugEnabled()) {
            log.debug("Exiting method: {} - returned {} items", methodName, resultCount);
        }
    }

    /**
     * Log method exit with single result
     */
    public static void logMethodExit(String methodName, Object result) {
        if (log.isDebugEnabled()) {
            log.debug("Exiting method: {} - returned: {}", methodName,
                    result != null ? result.getClass().getSimpleName() : "null");
        }
    }
}