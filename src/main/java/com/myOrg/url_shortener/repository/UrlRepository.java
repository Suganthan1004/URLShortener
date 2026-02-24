package com.myOrg.url_shortener.repository;

import com.myOrg.url_shortener.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    List<Url> findTop3ByOrderByTotalClicksDesc();
}