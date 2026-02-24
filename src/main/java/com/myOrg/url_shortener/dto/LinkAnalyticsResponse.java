package com.myOrg.url_shortener.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class LinkAnalyticsResponse {
    private String shortCode;
    private long totalClicks;
    private long clicksLast24Hours;
}
