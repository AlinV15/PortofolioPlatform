import com.example.portofolio.service.base.ServiceUtils;

import java.util.Map;

@lombok.Data
@lombok.Builder
public class CertificateStatisticsDto {
    private Long totalCertificates;
    private Long verifiedCount;
    private Double averageRelevanceScore;
    private Map<String, Long> providerDistribution;
    private Long expiringCount;
    private Long featuredCount;
    private Long highRelevanceCount;

    public Double getVerificationRate() {
        if (totalCertificates == 0) return 0.0;
        return ServiceUtils.calculatePercentage(verifiedCount, totalCertificates);
    }

    public Double getFeaturedPercentage() {
        if (totalCertificates == 0) return 0.0;
        return ServiceUtils.calculatePercentage(featuredCount, totalCertificates);
    }

    public String getTopProvider() {
        return ServiceUtils.findMostFrequent(
                providerDistribution.keySet().stream()
                        .toList()
        ).orElse("Unknown");
    }

    public Boolean hasExpiringCertificates() {
        return expiringCount != null && expiringCount > 0;
    }
}