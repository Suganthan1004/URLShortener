package com.jasmin.urlshortener.service;

import org.springframework.stereotype.Service;
import com.jasmin.urlshortener.entity.Url;
import com.jasmin.urlshortener.repository.UrlRepository;
import com.jasmin.urlshortener.util.ShortCodeGenerator;

import java.net.URL;

@Service
public class UrlService {

    private final UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public Url createShortUrl(String longUrl) {

        validateUrl(longUrl);

        String shortCode;

        do {
            shortCode = ShortCodeGenerator.generateCode();
        } while (urlRepository.existsByShortCode(shortCode));

        Url url = new Url();
        url.setLongUrl(longUrl);
        url.setShortCode(shortCode);
        url.setTotalClicks(0L);

        return urlRepository.save(url);
    }

    private void validateUrl(String longUrl) {
        try {
            new URL(longUrl).toURI();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL");
        }
    }
    public String getOriginalUrl(String shortCode) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        // handle null clicks
        if (url.getTotalClicks() == null) {
            url.setTotalClicks(0L);
        }

        url.setTotalClicks(url.getTotalClicks() + 1);
        urlRepository.save(url);

        return url.getLongUrl();
    }
}