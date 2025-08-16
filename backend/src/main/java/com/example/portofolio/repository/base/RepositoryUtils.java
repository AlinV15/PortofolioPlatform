package com.example.portofolio.repository.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Utility class for common repository operations - optimized for read-only portfolio
 */
public final class RepositoryUtils {

    private RepositoryUtils() {
        // Utility class
    }

    // ===== PAGINATION UTILITIES =====

    /**
     * Create default pageable (page 0, size 20, sorted by createdAt DESC)
     */
    public static Pageable createDefaultPageable() {
        return PageRequest.of(0, 20, Sort.by("createdAt").descending());
    }

    /**
     * Create pageable with default size (20)
     */
    public static Pageable createPageable(int page) {
        return PageRequest.of(page, 20, Sort.by("createdAt").descending());
    }

    /**
     * Create pageable with custom size
     */
    public static Pageable createPageable(int page, int size) {
        return PageRequest.of(page, size, Sort.by("createdAt").descending());
    }

    /**
     * Create pageable with sorting
     */
    public static Pageable createPageable(int page, int size, String sortBy, String direction) {
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(dir, sortBy));
    }

    /**
     * Create pageable for recent items (sorted by createdAt DESC)
     */
    public static Pageable createRecentPageable(int page, int size) {
        return PageRequest.of(page, size, Sort.by("createdAt").descending());
    }

    /**
     * Create pageable for featured items
     */
    public static Pageable createFeaturedPageable(int page, int size) {
        return PageRequest.of(page, size, Sort.by("updatedAt").descending());
    }

    // ===== DATE UTILITIES =====

    /**
     * Get start of current year
     */
    public static LocalDateTime getCurrentYearStart() {
        return LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    /**
     * Get start of current month
     */
    public static LocalDateTime getCurrentMonthStart() {
        return LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    /**
     * Get start of current week
     */
    public static LocalDateTime getCurrentWeekStart() {
        return LocalDateTime.now().minusDays(LocalDateTime.now().getDayOfWeek().getValue() - 1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    /**
     * Get date N days ago
     */
    public static LocalDateTime getDaysAgo(int days) {
        return LocalDateTime.now().minusDays(days);
    }

    /**
     * Get date N weeks ago
     */
    public static LocalDateTime getWeeksAgo(int weeks) {
        return LocalDateTime.now().minusWeeks(weeks);
    }

    /**
     * Get date N months ago
     */
    public static LocalDateTime getMonthsAgo(int months) {
        return LocalDateTime.now().minusMonths(months);
    }

    /**
     * Get date N years ago
     */
    public static LocalDateTime getYearsAgo(int years) {
        return LocalDateTime.now().minusYears(years);
    }

    // ===== STATISTICS UTILITIES =====

    /**
     * Convert Object[] query results to Map for statistics
     */
    public static Map<String, Long> convertToStatisticsMap(List<Object[]> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> ((Number) row[1]).longValue()
                ));
    }

    /**
     * Convert Object[] with date results to formatted statistics
     */
    public static Map<String, Long> convertDateStatistics(List<Object[]> results) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return results.stream()
                .collect(Collectors.toMap(
                        row -> ((LocalDateTime) row[0]).format(formatter),
                        row -> ((Number) row[1]).longValue()
                ));
    }

    /**
     * Convert monthly statistics (year, month, count) to formatted map
     */
    public static Map<String, Long> convertMonthlyStatistics(List<Object[]> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.format("%04d-%02d",
                                ((Number) row[0]).intValue(),
                                ((Number) row[1]).intValue()),
                        row -> ((Number) row[2]).longValue()
                ));
    }

    /**
     * Convert yearly statistics to map
     */
    public static Map<Integer, Long> convertYearlyStatistics(List<Object[]> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()
                ));
    }

    // ===== SEARCH UTILITIES =====

    /**
     * Prepare search term for LIKE queries (add wildcards and escape special chars)
     */
    public static String prepareSearchTerm(String term) {
        if (term == null || term.trim().isEmpty()) {
            return "%";
        }
        return "%" + term.trim().toLowerCase()
                .replace("%", "\\%")
                .replace("_", "\\_")
                .replace("'", "''") + "%";
    }

    /**
     * Split search term into keywords for multi-word search
     */
    public static List<String> splitSearchTerm(String term) {
        if (term == null || term.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(term.trim().toLowerCase().split("\\s+"));
    }

    /**
     * Clean search term (remove special characters, extra spaces)
     */
    public static String cleanSearchTerm(String term) {
        if (term == null) {
            return "";
        }
        return term.trim().replaceAll("[^a-zA-Z0-9\\s]", " ").replaceAll("\\s+", " ");
    }

    // ===== VALIDATION UTILITIES =====

    /**
     * Validate page parameters
     */
    public static void validatePageParameters(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be positive");
        }
        if (size > 1000) {
            throw new IllegalArgumentException("Page size cannot exceed 1000 for performance reasons");
        }
    }

    /**
     * Validate date range
     */
    public static void validateDateRange(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null && start.isAfter(end)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        // Check for reasonable date ranges (not too far in the past/future)
        LocalDateTime minDate = LocalDateTime.now().minusYears(50);
        LocalDateTime maxDate = LocalDateTime.now().plusYears(10);

        if (start != null && start.isBefore(minDate)) {
            throw new IllegalArgumentException("Start date is too far in the past");
        }
        if (end != null && end.isAfter(maxDate)) {
            throw new IllegalArgumentException("End date is too far in the future");
        }
    }

    /**
     * Validate year parameter
     */
    public static void validateYear(Integer year) {
        if (year == null) {
            return;
        }
        int currentYear = LocalDateTime.now().getYear();
        if (year < 1900 || year > currentYear + 10) {
            throw new IllegalArgumentException("Year must be between 1900 and " + (currentYear + 10));
        }
    }

    // ===== ID UTILITIES =====

    /**
     * Validate ID list is not empty and not too large
     */
    public static <ID> void validateIdList(List<ID> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("ID list cannot be empty");
        }
        if (ids.size() > 1000) {
            throw new IllegalArgumentException("Too many IDs provided (max 1000 for performance)");
        }
        // Remove null IDs
        if (ids.contains(null)) {
            throw new IllegalArgumentException("ID list cannot contain null values");
        }
    }

    /**
     * Split large ID list into chunks for batch processing
     */
    public static <ID> List<List<ID>> chunkIdList(List<ID> ids, int chunkSize) {
        if (chunkSize <= 0) {
            throw new IllegalArgumentException("Chunk size must be positive");
        }

        List<List<ID>> chunks = new ArrayList<>();
        for (int i = 0; i < ids.size(); i += chunkSize) {
            chunks.add(ids.subList(i, Math.min(ids.size(), i + chunkSize)));
        }
        return chunks;
    }

    // ===== PAGE UTILITIES =====

    /**
     * Check if page has content
     */
    public static <T> boolean hasContent(Page<T> page) {
        return page != null && page.hasContent();
    }

    /**
     * Get total pages safely
     */
    public static <T> int getTotalPages(Page<T> page) {
        return page != null ? page.getTotalPages() : 0;
    }

    /**
     * Get total elements safely
     */
    public static <T> long getTotalElements(Page<T> page) {
        return page != null ? page.getTotalElements() : 0L;
    }

    /**
     * Check if page is valid
     */
    public static <T> boolean isValidPage(Page<T> page, int requestedPage) {
        return page != null && requestedPage >= 0 && requestedPage < page.getTotalPages();
    }

    // ===== SORTING UTILITIES =====

    /**
     * Create sort by multiple fields with direction prefix (-field for DESC)
     */
    public static Sort createMultiFieldSort(String... fields) {
        if (fields == null || fields.length == 0) {
            return Sort.by("createdAt").descending();
        }

        List<Sort.Order> orders = new ArrayList<>();
        for (String field : fields) {
            if (field.startsWith("-")) {
                orders.add(Sort.Order.desc(field.substring(1)));
            } else {
                orders.add(Sort.Order.asc(field));
            }
        }
        return Sort.by(orders);
    }

    /**
     * Default sort for portfolio items (newest first)
     */
    public static Sort getDefaultSort() {
        return Sort.by("createdAt").descending();
    }

    /**
     * Sort for featured items (by importance and update date)
     */
    public static Sort getFeaturedSort() {
        return Sort.by(
                Sort.Order.desc("importance"),
                Sort.Order.desc("updatedAt")
        );
    }

    /**
     * Sort for timeline items (by date)
     */
    public static Sort getTimelineSort() {
        return Sort.by("createdAt").descending();
    }

    /**
     * Sort by popularity/usage (for skills, technologies)
     */
    public static Sort getPopularitySort() {
        return Sort.by(
                Sort.Order.desc("level"),
                Sort.Order.desc("projects"),
                Sort.Order.desc("createdAt")
        );
    }

    // ===== FILTERING UTILITIES =====

    /**
     * Create date filter for "recent" items (last 30 days)
     */
    public static LocalDateTime getRecentFilter() {
        return getDaysAgo(30);
    }

    /**
     * Create date filter for "this year" items
     */
    public static LocalDateTime getThisYearFilter() {
        return getCurrentYearStart();
    }

    /**
     * Create date filter for "this month" items
     */
    public static LocalDateTime getThisMonthFilter() {
        return getCurrentMonthStart();
    }

    // ===== PORTFOLIO-SPECIFIC UTILITIES =====

    /**
     * Get default page size for different entity types
     */
    public static int getDefaultPageSize(String entityType) {
        return switch (entityType.toLowerCase()) {
            case "project", "education", "volunteer" -> 10;
            case "skill", "technology" -> 50;
            case "achievement", "certificate" -> 20;
            case "hobby", "interest" -> 15;
            default -> 20;
        };
    }

    /**
     * Get max items for featured/highlight sections
     */
    public static int getFeaturedLimit(String entityType) {
        return switch (entityType.toLowerCase()) {
            case "project" -> 6;
            case "skill" -> 8;
            case "achievement" -> 4;
            case "technology" -> 10;
            default -> 5;
        };
    }

    /**
     * Validate entity type name
     */
    public static void validateEntityType(String entityType) {
        List<String> validTypes = List.of(
                "PROJECT", "SKILL", "TECHNOLOGY", "EDUCATION", "CERTIFICATE",
                "ACHIEVEMENT", "VOLUNTEER", "HOBBY", "INTEREST", "FUTURE_GOAL"
        );

        if (entityType == null || !validTypes.contains(entityType.toUpperCase())) {
            throw new IllegalArgumentException("Invalid entity type: " + entityType);
        }
    }

    // ===== PERFORMANCE UTILITIES =====

    /**
     * Calculate optimal batch size based on list size
     */
    public static int calculateOptimalBatchSize(int totalSize) {
        if (totalSize <= 100) return totalSize;
        if (totalSize <= 1000) return 100;
        return 500;
    }

    /**
     * Check if operation should be cached based on result size
     */
    public static boolean shouldCache(int resultSize) {
        return resultSize > 10; // Cache results with more than 10 items
    }

    /**
     * Get cache TTL based on entity type (in seconds)
     */
    public static int getCacheTTL(String entityType) {
        return switch (entityType.toLowerCase()) {
            case "project", "education" -> 3600; // 1 hour - stable data
            case "skill", "achievement" -> 1800; // 30 minutes - semi-stable
            case "learning_progress" -> 300; // 5 minutes - frequently updated
            default -> 1800; // 30 minutes default
        };
    }
}