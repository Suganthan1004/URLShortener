package com.myOrg.url_shortener.service;

import com.myOrg.url_shortener.dto.GlobalAnalyticsResponse;
import com.myOrg.url_shortener.dto.LinkAnalyticsResponse;
import com.myOrg.url_shortener.entity.Url;
import com.myOrg.url_shortener.entity.UrlClick;
import com.myOrg.url_shortener.repository.UrlClickRepository;
import com.myOrg.url_shortener.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UrlRepository urlRepository;
    private final UrlClickRepository urlClickRepository;

    // 1️⃣ Log click (used by redirect controller)
    public void logClick(Url url) {
        UrlClick click = UrlClick.builder()
                .url(url)
                .clickedAt(LocalDateTime.now())
                .build();

        urlClickRepository.save(click);
    }

    // 2️⃣ Global Analytics
    public GlobalAnalyticsResponse getGlobalAnalytics() {

        long totalUrls = urlRepository.count();

        long totalClicks = urlRepository
                .findAll()
                .stream()
                .mapToLong(Url::getTotalClicks)
                .sum();

        long clicksLast24Hours =
                urlClickRepository.countByClickedAtAfter(
                        LocalDateTime.now().minusHours(24)
                );

        // Top 3 links by total clicks
        List<Url> topUrls = urlRepository
                .findTop3ByOrderByTotalClicksDesc();

        return GlobalAnalyticsResponse.builder()
                .totalUrls(totalUrls)
                .totalClicks(totalClicks)
                .clicksLast24Hours(clicksLast24Hours)
                .topLinks(GlobalAnalyticsResponse.mapToTopLinks(topUrls))
                .build();
    }

    // 3️⃣ Specific Link Analytics
    public LinkAnalyticsResponse getLinkAnalytics(String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        long totalClicks = url.getTotalClicks();

        long clicksLast24Hours =
                urlClickRepository.countByUrlAndClickedAtAfter(
                        url,
                        LocalDateTime.now().minusHours(24)
                );

        return LinkAnalyticsResponse.builder()
                .shortCode(shortCode)
                .totalClicks(totalClicks)
                .clicksLast24Hours(clicksLast24Hours)
                .build();
    }
}