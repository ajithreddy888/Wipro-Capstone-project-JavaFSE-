package com.wipro.app_service.service;

import com.wipro.app_service.dto.AppRequest;
import com.wipro.app_service.dto.AppResponse;
import com.wipro.app_service.entity.App;
import com.wipro.app_service.entity.Download;
import com.wipro.app_service.repository.AppRepository;
import com.wipro.app_service.repository.DownloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppService {

    @Autowired
    private AppRepository appRepository;

    @Autowired
    private DownloadRepository downloadRepository;

    public AppResponse addApp(AppRequest request) {
        App app = new App();
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setCategory(request.getCategory());
        app.setDeveloperName(request.getDeveloperName());
        app.setDeveloperId(request.getDeveloperId());
        app.setImageUrl(request.getImageUrl());
        App saved = appRepository.save(app);
        return mapToResponse(saved);
    }

    public List<AppResponse> getAllApps() {
        return appRepository.findByStatus("ACTIVE")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppResponse getAppById(Long id) {
        App app = appRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App not found"));
        return mapToResponse(app);
    }

    public List<AppResponse> getAppsByCategory(String category) {
        return appRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppResponse> searchApps(String name) {
        return appRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppResponse> getAppsByDeveloper(Long developerId) {
        return appRepository.findByDeveloperId(developerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void incrementDownload(Long appId, Long userId) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("App not found"));
        app.setTotalDownloads(app.getTotalDownloads() + 1);
        appRepository.save(app);

        if (!downloadRepository.existsByUserIdAndAppId(userId, appId)) {
            Download download = new Download();
            download.setUserId(userId);
            download.setAppId(appId);
            download.setAppName(app.getName());
            downloadRepository.save(download);
        }
    }

    public AppResponse updateAverageRating(Long appId, double newRating) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("App not found"));
        app.setAverageRating(newRating);
        return mapToResponse(appRepository.save(app));
    }

    public List<Long> getUserDownloadedAppIds(Long userId) {
        return downloadRepository.findByUserId(userId)
                .stream()
                .map(Download::getAppId)
                .collect(Collectors.toList());
    }

    public List<String> getUserDownloadedAppNames(Long userId) {
        return downloadRepository.findByUserId(userId)
                .stream()
                .map(Download::getAppName)
                .collect(Collectors.toList());
    }

    public void removeByName(String name) {
        appRepository.findByNameContainingIgnoreCase(name)
                .forEach(app -> {
                    app.setStatus("INACTIVE");
                    appRepository.save(app);
                });
    }

    private AppResponse mapToResponse(App app) {
        return new AppResponse(
                app.getId(),
                app.getName(),
                app.getDescription(),
                app.getCategory(),
                app.getDeveloperName(),
                app.getAverageRating(),
                app.getTotalDownloads(),
                app.getStatus(),
                app.getImageUrl()
        );
    }
}
