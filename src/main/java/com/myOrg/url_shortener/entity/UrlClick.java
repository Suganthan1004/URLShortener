package com.myOrg.url_shortener.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "url_clicks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UrlClick {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many clicks belong to one URL
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id", nullable = false)
    private Url url;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;
}
