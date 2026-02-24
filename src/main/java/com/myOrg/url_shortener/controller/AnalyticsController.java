package com.myOrg.url_shortener.controller;

import com.myOrg.url_shortener.dto.GlobalAnalyticsResponse;
import com.myOrg.url_shortener.dto.LinkAnalyticsResponse;
import com.myOrg.url_shortener.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * 1️⃣ Global Analytics
     * GET /api/analytics/global
     */
    @GetMapping("/global")
    public ResponseEntity<GlobalAnalyticsResponse> getGlobalAnalytics() {
        GlobalAnalyticsResponse response = analyticsService.getGlobalAnalytics();
        return ResponseEntity.ok(response);
    }

    /**
     * 2️⃣ Specific Link Analytics
     * GET /api/analytics/{shortCode}
     */
    @GetMapping("/{shortCode}")
    public ResponseEntity<LinkAnalyticsResponse> getLinkAnalytics(
            @PathVariable String shortCode) {

        LinkAnalyticsResponse response =
                analyticsService.getLinkAnalytics(shortCode);

        return ResponseEntity.ok(response);
    }
}
