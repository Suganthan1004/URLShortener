package com.myOrg.url_shortener.service;

import com.myOrg.url_shortener.entity.Url;
import com.myOrg.url_shortener.repository.UrlRepository;
import com.myOrg.url_shortener.util.ShortCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;

    public Url createShortUrl(String longUrl) {

        String shortCode;

        do {
            shortCode = ShortCodeGenerator.generate();
        } while (urlRepository.findByShortCode(shortCode).isPresent());

        Url url = Url.builder()
                .longUrl(longUrl)
                .shortCode(shortCode)
                .totalClicks(0)
                .createdAt(LocalDateTime.now())
                .build();

        return urlRepository.save(url);
    }

    public Url getByShortCode(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));
    }

    public void incrementClick(Url url) {
        url.setTotalClicks(url.getTotalClicks() + 1);
        urlRepository.save(url);
    }
}