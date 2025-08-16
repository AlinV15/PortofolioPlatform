package com.example.portofolio.service.base;

import com.example.portofolio.repository.base.RepositoryUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Base service providing read-only operations for portfolio display
 * @param <T> Entity type
 * @param <ID> Entity ID type
 * @param <R> Repository type
 */
@Transactional(readOnly = true)
@Slf4j
public abstract class BaseService<T, ID, R extends JpaRepository<T, ID>> {

    protected final R repository;

    protected BaseService(R repository) {
        this.repository = repository;
    }

    // ===== BASIC READ OPERATIONS =====

    /**
     * Find entity by ID
     */
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    /**
     * Find entity by ID and throw exception if not found
     */
    public T getById(ID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entity not found with id: " + id));
    }

    /**
     * Find all entities
     */
    public List<T> findAll() {
        return repository.findAll();
    }

    /**
     * Find all entities with pagination
     */
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    /**
     * Find all entities with default pagination
     */
    public Page<T> findAll(int page, int size) {
        RepositoryUtils.validatePageParameters(page, size);
        Pageable pageable = RepositoryUtils.createPageable(page, size);
        return repository.findAll(pageable);
    }

    /**
     * Find entities by multiple IDs
     */
    public List<T> findByIds(List<Long> ids) {
        RepositoryUtils.validateIdList(ids);
        return repository.findAllById((Iterable<ID>) ids);
    }

    /**
     * Check if entity exists
     */
    public boolean exists(ID id) {
        return repository.existsById(id);
    }

    /**
     * Count total entities
     */
    public long count() {
        return repository.count();
    }

    // ===== RECENT ITEMS (to be implemented in specific services) =====

    /**
     * Find recently created entities (override in specific services with date fields)
     */
    public List<T> findRecentlyCreated(int days) {
        // Override in specific services that have createdAt or date fields
        log.warn("findRecentlyCreated not implemented for entity type: {}", getEntityTypeName());
        return List.of();
    }

    /**
     * Find recently updated entities (override in specific services with date fields)
     */
    public List<T> findRecentlyUpdated(int days) {
        // Override in specific services that have updatedAt or date fields
        log.warn("findRecentlyUpdated not implemented for entity type: {}", getEntityTypeName());
        return List.of();
    }

    /**
     * Find recent items with limit (basic implementation)
     */
    public List<T> findRecentItems(int limit) {
        Pageable pageable = RepositoryUtils.createPageable(0, limit);
        Page<T> page = repository.findAll(pageable);
        return page.getContent();
    }

    /**
     * Find recent entities with pagination (basic implementation)
     */
    public Page<T> findRecentlyCreated(int page, int size) {
        RepositoryUtils.validatePageParameters(page, size);
        Pageable pageable = RepositoryUtils.createPageable(page, size);
        return repository.findAll(pageable);
    }

    // ===== SEARCH & FILTERING (using existing repository methods) =====

    /**
     * Search entities by term (override in specific services)
     */
    public List<T> search(String searchTerm) {
        // Base implementation - override in specific services
        return findAll();
    }

    /**
     * Get available years (override in specific services)
     */
    public List<Integer> getAvailableYears() {
        // Override in specific services that have date fields
        return List.of();
    }

    // ===== STATISTICS & ANALYTICS (using basic JPA methods) =====

    /**
     * Get basic statistics (override for specific analytics)
     */
    public Map<String, Long> getBasicStats() {
        return Map.of("total", count());
    }

    // ===== METADATA SUPPORT (optional - override in services that use EntityMetadata) =====

    /**
     * Find featured entities (override in services with metadata)
     */
    public List<T> findFeatured() {
        // Override in services that have EntityMetadata relationship
        return List.of();
    }

    /**
     * Check if entity has metadata (override in services with metadata)
     */
    public boolean hasMetadata(ID id) {
        // Override in services that have EntityMetadata relationship
        return false;
    }

    // ===== UTILITY METHODS =====

    /**
     * Refresh/reload entity from database
     */
    public Optional<T> refresh(ID id) {
        return repository.findById(id);
    }

    /**
     * Check if entities exist with given IDs
     */
    public boolean existsByIds(List<ID> ids) {
        RepositoryUtils.validateIdList((List<Long>) ids);
        return repository.findAllById(ids).size() == ids.size();
    }

    // ===== TEMPLATE METHODS =====

    /**
     * Get entity type name for metadata queries - implement in subclasses if needed
     */
    protected String getEntityTypeName() {
        return "UNKNOWN";
    }

    /**
     * Transform entity to DTO - must be implemented by subclasses
     */
    protected abstract Object toDto(T entity);

    /**
     * Transform entities to DTOs
     */
    public List<Object> toDtos(List<T> entities) {
        return entities.stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Transform page of entities to DTOs
     */
    public PageDto<Object> toDtos(Page<T> page) {
        List<Object> dtos = page.getContent().stream()
                .map(this::toDto)
                .toList();

        return PageDto.builder()
                .content(dtos)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    // ===== CONVENIENCE METHODS =====

    /**
     * Get dashboard statistics (basic implementation)
     */
    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalCount(count())
                .featuredCount((long) findFeatured().size())
                .recentCount(0L) // Override in subclasses
                .availableYears(getAvailableYears())
                .importanceDistribution(Map.of())
                .build();
    }
}

// ===== SUPPORTING CLASSES =====

/**
 * Exception thrown when entity is not found
 */
class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}

/**
 * Generic page DTO for API responses
 */
@lombok.Data
@lombok.Builder
class PageDto<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    private boolean hasNext;
    private boolean hasPrevious;
}

/**
 * Dashboard statistics DTO
 */
@lombok.Data
@lombok.Builder
class DashboardStats {
    private long totalCount;
    private long featuredCount;
    private long recentCount;
    private List<Integer> availableYears;
    private Map<String, Long> importanceDistribution;
}

/**
 * Timeline data DTO
 */
@lombok.Data
@lombok.Builder
class TimelineData {
    private Integer year;
    private Long count;
    private String entityType;
}