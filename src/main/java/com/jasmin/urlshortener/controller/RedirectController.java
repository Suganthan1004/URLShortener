package com.jasmin.urlshortener.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.jasmin.urlshortener.service.UrlService;

@RestController
public class RedirectController {

    private final UrlService urlService;

    public RedirectController(UrlService urlService) {
        this.urlService = urlService;
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {

        String originalUrl = urlService.getOriginalUrl(shortCode);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", originalUrl);

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}