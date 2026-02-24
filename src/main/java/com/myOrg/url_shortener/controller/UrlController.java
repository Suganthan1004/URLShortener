package com.myOrg.url_shortener.controller;

import com.myOrg.url_shortener.entity.Url;
import com.myOrg.url_shortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @Value("${server.port}")
    private String serverPort;

    @PostMapping("/shorten")
    public ResponseEntity<?> createShortUrl(@RequestBody Map<String, String> body) {

        String longUrl = body.get("longUrl");

        Url url = urlService.createShortUrl(longUrl);

        return ResponseEntity.ok(Map.of(
                "shortUrl", "http://localhost:" + serverPort + "/" + url.getShortCode(),
                "shortCode", url.getShortCode()
        ));
    }
}