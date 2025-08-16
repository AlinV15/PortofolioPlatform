package com.example.portofolio.repository.base;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Utility class for repository operations
 */
public class RepositoryUtils {

    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_PAGE_SIZE = 20;

    // ===== PAGINATION UTILITIES =====

    /**
     * Validate page parameters
     */
    public static void validatePageParameters(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page index cannot be negative");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be positive");
        }
        if (size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Page size cannot exceed " + MAX_PAGE_SIZE);
        }
    }

    /**
     * Create pageable with validation
     */
    public static Pageable createPageable(int page, int size) {
        validatePageParameters(page, size);
        return PageRequest.of(page, size);
    }

    /**
     * Create pageable with default size
     */
    public static Pageable createPageable(int page) {
        return createPageable(page, DEFAULT_PAGE_SIZE);
    }

    /**
     * Create pageable with sorting
     */
    public static Pageable createPageable(int page, int size, String sortBy, String direction) {
        validatePageParameters(page, size);
        validateSortParameters(sortBy, direction);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Sort sort = Sort.by(sortDirection, sortBy);
        return PageRequest.of(page, size, sort);
    }

    /**
     * Create pageable with multiple sort fields
     */
    public static Pageable createPageable(int page, int size, Sort sort) {
        validatePageParameters(page, size);
        if (sort == null) {
            return PageRequest.of(page, size);
        }
        return PageRequest.of(page, size, sort);
    }

    // ===== SORT UTILITIES =====

    /**
     * Validate sort parameters
     */
    public static void validateSortParameters(String sortBy, String direction) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            throw new IllegalArgumentException("Sort field cannot be null or empty");
        }
        if (direction == null || direction.trim().isEmpty()) {
            throw new IllegalArgumentException("Sort direction cannot be null or empty");
        }

        String normalizedDirection = direction.toUpperCase();
        if (!normalizedDirection.equals("ASC") && !normalizedDirection.equals("DESC")) {
            throw new IllegalArgumentException("Sort direction must be 'ASC' or 'DESC'");
        }
    }

    /**
     * Create sort object from string parameters
     */
    public static Sort createSort(String sortBy, String direction) {
        validateSortParameters(sortBy, direction);
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        return Sort.by(sortDirection, sortBy);
    }

    /**
     * Create sort with multiple fields
     */
    public static Sort createSort(String... sortFields) {
        if (sortFields == null || sortFields.length == 0) {
            throw new IllegalArgumentException("Sort fields cannot be null or empty");
        }
        return Sort.by(sortFields);
    }

    // ===== ID VALIDATION UTILITIES =====

    /**
     * Validate single ID
     */
    public static void validateId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (id <= 0) {
            throw new IllegalArgumentException("ID must be positive");
        }
    }

    /**
     * Validate ID list
     */
    public static void validateIdList(List<Long> ids) {
        if (ids == null) {
            throw new IllegalArgumentException("ID list cannot be null");
        }
        if (ids.isEmpty()) {
            throw new IllegalArgumentException("ID list cannot be empty");
        }
        if (ids.size() > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("ID list size cannot exceed " + MAX_PAGE_SIZE);
        }

        for (Long id : ids) {
            validateId(id);
        }
    }

    /**
     * Validate personal ID (common validation)
     */
    public static void validatePersonalId(Long personalId) {
        validateId(personalId);
        // Add any additional personal ID specific validations here
    }

    // ===== SEARCH UTILITIES =====

    /**
     * Validate search term
     */
    public static void validateSearchTerm(String searchTerm) {
        if (searchTerm == null) {
            throw new IllegalArgumentException("Search term cannot be null");
        }
        if (searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be empty");
        }
        if (searchTerm.length() < 2) {
            throw new IllegalArgumentException("Search term must be at least 2 characters");
        }
        if (searchTerm.length() > 100) {
            throw new IllegalArgumentException("Search term cannot exceed 100 characters");
        }
    }

    /**
     * Sanitize search term for SQL LIKE queries
     */
    public static String sanitizeSearchTerm(String searchTerm) {
        if (searchTerm == null) {
            return "";
        }

        // Remove SQL injection characters and trim
        return searchTerm.trim()
                .replaceAll("[%_\\\\]", "\\\\$0") // Escape SQL wildcards
                .replaceAll("[';\"\\-\\-/\\*]", ""); // Remove potential SQL injection chars
    }

    /**
     * Prepare search term for LIKE query (add wildcards)
     */
    public static String prepareSearchTerm(String searchTerm) {
        validateSearchTerm(searchTerm);
        String sanitized = sanitizeSearchTerm(searchTerm);
        return "%" + sanitized + "%";
    }

    // ===== DATE UTILITIES =====

    /**
     * Validate year parameter
     */
    public static void validateYear(Integer year) {
        if (year == null) {
            throw new IllegalArgumentException("Year cannot be null");
        }
        if (year < 1900 || year > 2100) {
            throw new IllegalArgumentException("Year must be between 1900 and 2100");
        }
    }

    // ===== LIMIT UTILITIES =====

    /**
     * Validate and adjust limit parameter
     */
    public static int validateAndAdjustLimit(int limit) {
        if (limit <= 0) {
            throw new IllegalArgumentException("Limit must be positive");
        }
        if (limit > MAX_PAGE_SIZE) {
            return MAX_PAGE_SIZE; // Cap at maximum
        }
        return limit;
    }

    /**
     * Validate limit with default
     */
    public static int validateLimit(Integer limit, int defaultLimit) {
        if (limit == null) {
            return defaultLimit;
        }
        return validateAndAdjustLimit(limit);
    }

    // ===== CONSTANTS =====

    /**
     * Get maximum page size
     */
    public static int getMaxPageSize() {
        return MAX_PAGE_SIZE;
    }

    /**
     * Get default page size
     */
    public static int getDefaultPageSize() {
        return DEFAULT_PAGE_SIZE;
    }

    // ===== COMMON SORT CONFIGURATIONS =====

    /**
     * Sort by creation date descending (most recent first)
     */
    public static Sort sortByCreatedDateDesc() {
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    /**
     * Sort by update date descending
     */
    public static Sort sortByUpdatedDateDesc() {
        return Sort.by(Sort.Direction.DESC, "updatedAt");
    }

    /**
     * Sort by name ascending
     */
    public static Sort sortByNameAsc() {
        return Sort.by(Sort.Direction.ASC, "name");
    }

    /**
     * Sort by level descending (for skills, achievements, etc.)
     */
    public static Sort sortByLevelDesc() {
        return Sort.by(Sort.Direction.DESC, "level");
    }

    /**
     * Sort by date descending (for achievements, projects, etc.)
     */
    public static Sort sortByDateDesc(String dateField) {
        return Sort.by(Sort.Direction.DESC, dateField);
    }
}