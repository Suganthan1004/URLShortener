package com.jasmin.urlshortener.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.jasmin.urlshortener.service.UrlService;
import com.jasmin.urlshortener.entity.Url;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody Map<String, String> request) {

        String longUrl = request.get("longUrl");

        try {
            Url savedUrl = urlService.createShortUrl(longUrl);

            Map<String, String> response = new HashMap<>();
            response.put("shortCode", savedUrl.getShortCode());
            response.put("shortUrl",
                    "http://localhost:8080/" + savedUrl.getShortCode());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid URL");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error");
        }
    }
}