package com.wipro.developer_service.service;

import com.wipro.developer_service.dto.DeveloperAppRequest;
import com.wipro.developer_service.dto.DeveloperAppResponse;
import com.wipro.developer_service.entity.AppVersion;
import com.wipro.developer_service.entity.DeveloperApp;
import com.wipro.developer_service.repository.AppVersionRepository;
import com.wipro.developer_service.repository.DeveloperAppRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DeveloperService {

    @Autowired
    private DeveloperAppRepository developerAppRepository;

    @Autowired
    private AppVersionRepository appVersionRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.service.url}")
    private String appServiceUrl;

    public DeveloperAppResponse createApp(DeveloperAppRequest request, Long developerId) {
        DeveloperApp app = new DeveloperApp();
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setCategory(request.getCategory());
        app.setDeveloperId(developerId);
        app.setDeveloperName(request.getDeveloperName());
        app.setCurrentVersion(request.getCurrentVersion());
        app.setReleaseNotes(request.getReleaseNotes());
        app.setImageUrl(request.getImageUrl());

        DeveloperApp saved = developerAppRepository.save(app);

        AppVersion version = new AppVersion();
        version.setAppId(saved.getId());
        version.setVersion(saved.getCurrentVersion());
        version.setReleaseNotes(saved.getReleaseNotes());
        appVersionRepository.save(version);

        return mapToResponse(saved);
    }

    public DeveloperAppResponse updateApp(Long id, DeveloperAppRequest request, Long developerId) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Unauthorized to update this app");
        }

        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setCategory(request.getCategory());
        app.setReleaseNotes(request.getReleaseNotes());
        app.setImageUrl(request.getImageUrl());

        DeveloperApp saved = developerAppRepository.save(app);

        if (saved.getStatus().equals("PUBLISHED")) {
            syncUpdateToMarketplace(saved);
        }

        return mapToResponse(saved);
    }

    public DeveloperAppResponse releaseNewVersion(Long id, String newVersion,
                                                   String releaseNotes, Long developerId) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Unauthorized to update version");
        }

        String oldVersion = app.getCurrentVersion();
        app.setCurrentVersion(newVersion);
        app.setReleaseNotes(releaseNotes);
        app.setStatus("PENDING"); // Re-submit for review on new version

        DeveloperApp saved = developerAppRepository.save(app);

        // Save version history
        AppVersion version = new AppVersion();
        version.setAppId(id);
        version.setVersion(newVersion);
        version.setReleaseNotes(releaseNotes);
        appVersionRepository.save(version);

        System.out.println("New version released: " + oldVersion + " → " + newVersion);

        return mapToResponse(saved);
    }

    public void deleteApp(Long id, Long developerId) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Unauthorized to delete this app");
        }

        // Delete all version history first
        List<AppVersion> versions = appVersionRepository.findByAppId(id);
        appVersionRepository.deleteAll(versions);

        // Delete from dev_db
        developerAppRepository.delete(app);

        // Remove from app_db marketplace
        removeFromMarketplace(app.getName());
    }

    public List<DeveloperAppResponse> getMyApps(Long developerId) {
        return developerAppRepository.findByDeveloperId(developerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DeveloperAppResponse getAppById(Long id) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));
        return mapToResponse(app);
    }

    public DeveloperAppResponse submitForReview(Long id, Long developerId) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Unauthorized");
        }

        app.setStatus("PENDING");
        return mapToResponse(developerAppRepository.save(app));
    }

    public DeveloperAppResponse approveApp(Long id) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        app.setStatus("PUBLISHED");
        DeveloperApp saved = developerAppRepository.save(app);
        syncToMarketplace(saved);
        return mapToResponse(saved);
    }

    public DeveloperAppResponse blockApp(Long id) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        app.setStatus("BLOCKED");
        DeveloperApp saved = developerAppRepository.save(app);
        removeFromMarketplace(app.getName());
        return mapToResponse(saved);
    }

    public List<DeveloperAppResponse> getAppsByStatus(String status) {
        return developerAppRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DeveloperAppResponse> getAllApps() {
        return developerAppRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppVersion> getVersionHistory(Long appId) {
        return appVersionRepository.findByAppId(appId);
    }

    public List<DeveloperAppResponse> getAllPublishedApps() {
        return developerAppRepository.findByStatus("PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DeveloperAppResponse unpublishApp(Long id, Long developerId) {
        DeveloperApp app = developerAppRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));

        if (!app.getDeveloperId().equals(developerId)) {
            throw new RuntimeException("Unauthorized to unpublish this app");
        }

        app.setStatus("UNPUBLISHED");
        return mapToResponse(developerAppRepository.save(app));
    }

    @CircuitBreaker(name = "marketplaceSync", fallbackMethod = "syncFallback")
    public void syncToMarketplace(DeveloperApp app) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", app.getName());
        request.put("description", app.getDescription());
        request.put("category", app.getCategory());
        request.put("developerName", app.getDeveloperName());
        request.put("developerId", app.getDeveloperId());
        request.put("imageUrl", app.getImageUrl());

        restTemplate.postForEntity(
                appServiceUrl + "/api/apps/add",
                request,
                Object.class
        );
        System.out.println("Synced to marketplace: " + app.getName());
    }

    public void syncFallback(DeveloperApp app, Exception e) {
        System.out.println("Circuit breaker open — sync skipped for: "
                + app.getName() + " | Reason: " + e.getMessage());
    }

    @CircuitBreaker(name = "marketplaceSync", fallbackMethod = "syncUpdateFallback")
    public void syncUpdateToMarketplace(DeveloperApp app) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", app.getName());
        request.put("description", app.getDescription());
        request.put("category", app.getCategory());
        request.put("developerName", app.getDeveloperName());
        request.put("developerId", app.getDeveloperId());
        request.put("imageUrl", app.getImageUrl());

        restTemplate.put(
                appServiceUrl + "/api/apps/update-by-name?name=" + app.getName(),
                request
        );
        System.out.println("Updated in marketplace: " + app.getName());
    }

    public void syncUpdateFallback(DeveloperApp app, Exception e) {
        System.out.println("Update sync fallback for: " + app.getName());
    }

    @CircuitBreaker(name = "marketplaceSync", fallbackMethod = "removeFallback")
    public void removeFromMarketplace(String appName) {
        restTemplate.delete(appServiceUrl + "/api/apps/remove-by-name?name=" + appName);
        System.out.println("Removed from marketplace: " + appName);
    }

    public void removeFallback(String appName, Exception e) {
        System.out.println("Remove fallback fired for: " + appName);
    }

    private DeveloperAppResponse mapToResponse(DeveloperApp app) {
        return new DeveloperAppResponse(
                app.getId(),
                app.getName(),
                app.getDescription(),
                app.getCategory(),
                app.getDeveloperName(),
                app.getCurrentVersion(),
                app.getReleaseNotes(),
                app.getStatus(),
                app.getTotalDownloads(),
                app.getImageUrl(),
                app.getCreatedAt(),
                app.getUpdatedAt()
        );
    }
}