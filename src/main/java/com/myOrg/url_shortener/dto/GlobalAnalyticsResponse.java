package com.myOrg.url_shortener.dto;

import com.myOrg.url_shortener.entity.Url;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalAnalyticsResponse {

    private long totalUrls;
    private long totalClicks;
    private long clicksLast24Hours;

    // Simplified top links response
    private List<TopLink> topLinks;

    // Static mapper method to convert Url → TopLink
    public static List<TopLink> mapToTopLinks(List<Url> urls) {
        return urls.stream()
                .map(url -> TopLink.builder()
                        .shortCode(url.getShortCode())
                        .totalClicks(url.getTotalClicks())
                        .build())
                .collect(Collectors.toList());
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopLink {
        private String shortCode;
        private long totalClicks;
    }
}