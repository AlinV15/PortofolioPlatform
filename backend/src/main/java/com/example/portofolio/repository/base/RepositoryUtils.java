package com.example.portofolio.repository.base;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Utility class for repository operations
 */
public class RepositoryUtils {

    private static final int MAX_PAGE_SIZE = 100;

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
     * Validate personal ID (common validation)
     */
    public static void validatePersonalId(Long personalId) {
        validateId(personalId);
        // Add any additional personal ID specific validations here
    }

}