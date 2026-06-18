package com.wipro.app_service.service;

import com.wipro.app_service.dto.AppRequest;
import com.wipro.app_service.dto.AppResponse;
import com.wipro.app_service.entity.App;
import com.wipro.app_service.entity.Download;
import com.wipro.app_service.repository.AppRepository;
import com.wipro.app_service.repository.DownloadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppService {

    private static final Logger logger = LoggerFactory.getLogger(AppService.class);

    @Autowired
    private AppRepository appRepository;

    @Autowired
    private DownloadRepository downloadRepository;

    public AppResponse addApp(AppRequest request) {
        logger.info("Adding new app: {}", request.getName());
        App app = new App();
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setCategory(request.getCategory());
        app.setDeveloperName(request.getDeveloperName());
        app.setDeveloperId(request.getDeveloperId());
        app.setImageUrl(request.getImageUrl());
        App saved = appRepository.save(app);
        logger.info("App added successfully with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    public List<AppResponse> getAllApps() {
        logger.info("Fetching all active apps");
        return appRepository.findByStatus("ACTIVE").stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public AppResponse getAppById(Long id) {
        logger.info("Fetching app with ID: {}", id);
        App app = appRepository.findById(id).orElseThrow(() -> new RuntimeException("App not found"));
        logger.info("App fetched successfully: {}", app.getName());
        return mapToResponse(app);
    }

    public List<AppResponse> getAppsByCategory(String category) {
        logger.info("Fetching apps in category: {}", category);
        return appRepository.findByCategory(category).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AppResponse> searchApps(String name) {
        logger.info("Searching apps with name: {}", name);
        return appRepository.findByNameContainingIgnoreCase(name).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AppResponse> getAppsByDeveloper(Long developerId) {
        logger.info("Fetching apps for developer ID: {}", developerId);
        return appRepository.findByDeveloperId(developerId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void incrementDownload(Long appId, Long userId) {
        logger.info("Incrementing download count for app {} by user {}", appId, userId);
        App app = appRepository.findById(appId).orElseThrow(() -> new RuntimeException("App not found"));
        app.setTotalDownloads(app.getTotalDownloads() + 1);
        appRepository.save(app);
        logger.info("Download count updated for app {}", appId);
        if (!downloadRepository.existsByUserIdAndAppId(userId, appId)) {
            Download download = new Download();
            download.setUserId(userId);
            download.setAppId(appId);
            download.setAppName(app.getName());
            downloadRepository.save(download);
            logger.info("Download history saved for user {} and app {}", userId, appId);
        }
    }

    public AppResponse updateAverageRating(Long appId, double newRating) {
        logger.info("Updating average rating for app {}", appId);
        App app = appRepository.findById(appId).orElseThrow(() -> new RuntimeException("App not found"));
        app.setAverageRating(newRating);
        logger.info("Average rating updated to {}", newRating);
        return mapToResponse(appRepository.save(app));
    }

    public List<Long> getUserDownloadedAppIds(Long userId) {
        logger.info("Fetching downloaded app IDs for user {}", userId);
        return downloadRepository.findByUserId(userId).stream().map(Download::getAppId).collect(Collectors.toList());
    }

    public List<String> getUserDownloadedAppNames(Long userId) {
        logger.info("Fetching downloaded app names for user {}", userId);
        return downloadRepository.findByUserId(userId).stream().map(Download::getAppName).collect(Collectors.toList());
    }

    public void removeByName(String name) {
        logger.info("Removing app(s) with name containing '{}'", name);
        appRepository.findByNameContainingIgnoreCase(name).forEach(app -> {
            app.setStatus("INACTIVE");
            appRepository.save(app);
            logger.info("App '{}' marked as INACTIVE", app.getName());
        });
    }

    public void updateByName(String name, AppRequest request) {
        logger.info("Updating app(s) with name containing '{}'", name);
        appRepository.findByNameContainingIgnoreCase(name).forEach(app -> {
            app.setName(request.getName());
            app.setDescription(request.getDescription());
            app.setCategory(request.getCategory());
            app.setImageUrl(request.getImageUrl());
            appRepository.save(app);
            logger.info("App '{}' updated successfully", app.getName());
        });
    }

    private AppResponse mapToResponse(App app) {
        return new AppResponse(app.getId(), app.getName(), app.getDescription(), app.getCategory(),
                app.getDeveloperName(), app.getAverageRating(), app.getTotalDownloads(),
                app.getStatus(), app.getImageUrl());
    }
}
