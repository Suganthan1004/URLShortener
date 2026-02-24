package com.jasmin.urlshortener.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jasmin.urlshortener.entity.Url;

import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {

    boolean existsByShortCode(String shortCode);

    Optional<Url> findByShortCode(String shortCode);
}