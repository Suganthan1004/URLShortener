package com.myOrg.url_shortener.controller;

import com.myOrg.url_shortener.entity.Url;
import com.myOrg.url_shortener.service.AnalyticsService;
import com.myOrg.url_shortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;
    private final AnalyticsService analyticsService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {

        Url url = urlService.getByShortCode(shortCode);

        analyticsService.logClick(url);
        urlService.incrementClick(url);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url.getLongUrl()))
                .build();
    }
}