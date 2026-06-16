package com.wipro.ai_service.dto;

import java.util.List;

public class RecommendationRequest {

    private List<String> downloadedApps;
    private List<String> availableApps;

    public List<String> getDownloadedApps() { return downloadedApps; }
    public void setDownloadedApps(List<String> downloadedApps) { this.downloadedApps = downloadedApps; }

    public List<String> getAvailableApps() { return availableApps; }
    public void setAvailableApps(List<String> availableApps) { this.availableApps = availableApps; }
}
