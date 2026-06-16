package com.wipro.ai_service.dto;

import java.util.List;

public class RecommendationResponse {

    private List<String> recommendedApps;

    public RecommendationResponse() {}

    public RecommendationResponse(List<String> recommendedApps) {
        this.recommendedApps = recommendedApps;
    }

    public List<String> getRecommendedApps() { return recommendedApps; }
    public void setRecommendedApps(List<String> recommendedApps) { this.recommendedApps = recommendedApps; }
}
