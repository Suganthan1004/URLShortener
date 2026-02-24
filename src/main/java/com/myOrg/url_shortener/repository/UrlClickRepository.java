package com.myOrg.url_shortener.repository;

import com.myOrg.url_shortener.entity.Url;
import com.myOrg.url_shortener.entity.UrlClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface UrlClickRepository extends JpaRepository<UrlClick, Long> {

    // Count clicks in last 24 hours (GLOBAL)
    long countByClickedAtAfter(LocalDateTime time);

    // Count clicks in last 24 hours for specific URL
    long countByUrlAndClickedAtAfter(Url url, LocalDateTime time);
}