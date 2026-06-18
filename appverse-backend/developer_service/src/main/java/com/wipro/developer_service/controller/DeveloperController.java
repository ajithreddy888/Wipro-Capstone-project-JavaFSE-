package com.wipro.developer_service.controller;


import com.wipro.developer_service.dto.DeveloperAppRequest;
import com.wipro.developer_service.dto.DeveloperAppResponse;
import com.wipro.developer_service.entity.AppVersion;
import com.wipro.developer_service.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/developer")
public class DeveloperController {

    private static final Logger logger = LoggerFactory.getLogger(DeveloperController.class);

    @Autowired
    private DeveloperService developerService;

    @PostMapping("/apps/create")
    public ResponseEntity<DeveloperAppResponse> createApp(
            @RequestBody DeveloperAppRequest request,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Create app request received from developerId: {}", developerId);

        DeveloperAppResponse response = developerService.createApp(request, developerId);

        logger.info("App created successfully for developerId: {}", developerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/apps/my")
    public ResponseEntity<List<DeveloperAppResponse>> getMyApps(Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Fetching apps for developerId: {}", developerId);

        List<DeveloperAppResponse> response = developerService.getMyApps(developerId);

        logger.info("Successfully fetched apps for developerId: {}", developerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/apps/{id}")
    public ResponseEntity<DeveloperAppResponse> getAppById(@PathVariable Long id) {

        logger.info("Fetching app details for appId: {}", id);

        DeveloperAppResponse response = developerService.getAppById(id);

        logger.info("Successfully fetched app details for appId: {}", id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/apps/{id}/submit")
    public ResponseEntity<DeveloperAppResponse> submitForReview(
            @PathVariable Long id,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Developer {} submitting app {} for review", developerId, id);

        DeveloperAppResponse response = developerService.submitForReview(id, developerId);

        logger.info("App {} submitted for review successfully", id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/apps/{id}/update")
    public ResponseEntity<DeveloperAppResponse> updateApp(
            @PathVariable Long id,
            @RequestBody DeveloperAppRequest request,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Developer {} updating app {}", developerId, id);

        DeveloperAppResponse response = developerService.updateApp(id, request, developerId);

        logger.info("App {} updated successfully", id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/apps/{id}/new-version")
    public ResponseEntity<DeveloperAppResponse> releaseNewVersion(
            @PathVariable Long id,
            @RequestParam String newVersion,
            @RequestParam String releaseNotes,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Developer {} releasing version {} for app {}", developerId, newVersion, id);

        DeveloperAppResponse response =
                developerService.releaseNewVersion(id, newVersion, releaseNotes, developerId);

        logger.info("New version {} released successfully for app {}", newVersion, id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/apps/{id}/delete")
    public ResponseEntity<String> deleteApp(
            @PathVariable Long id,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Developer {} deleting app {}", developerId, id);

        developerService.deleteApp(id, developerId);

        logger.info("App {} deleted successfully", id);
        return ResponseEntity.ok("App deleted successfully");
    }

    @PutMapping("/apps/{id}/unpublish")
    public ResponseEntity<DeveloperAppResponse> unpublishApp(
            @PathVariable Long id,
            Authentication authentication) {

        Long developerId = (Long) authentication.getPrincipal();
        logger.info("Developer {} unpublishing app {}", developerId, id);

        DeveloperAppResponse response = developerService.unpublishApp(id, developerId);

        logger.info("App {} unpublished successfully", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/apps/{id}/versions")
    public ResponseEntity<List<AppVersion>> getVersionHistory(@PathVariable Long id) {

        logger.info("Fetching version history for app {}", id);

        List<AppVersion> versions = developerService.getVersionHistory(id);

        logger.info("Version history fetched successfully for app {}", id);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/apps/published")
    public ResponseEntity<List<DeveloperAppResponse>> getAllPublished() {

        logger.info("Fetching all published apps");

        List<DeveloperAppResponse> response = developerService.getAllPublishedApps();

        logger.info("Published apps fetched successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/apps/{id}/approve")
    public ResponseEntity<DeveloperAppResponse> approveApp(@PathVariable Long id) {

        logger.info("Admin approving app {}", id);

        DeveloperAppResponse response = developerService.approveApp(id);

        logger.info("App {} approved successfully", id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/apps/{id}/block")
    public ResponseEntity<DeveloperAppResponse> blockApp(@PathVariable Long id) {

        logger.info("Admin blocking app {}", id);

        DeveloperAppResponse response = developerService.blockApp(id);

        logger.info("App {} blocked successfully", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/apps/pending")
    public ResponseEntity<List<DeveloperAppResponse>> getPendingApps() {

        logger.info("Fetching all pending apps");

        List<DeveloperAppResponse> response = developerService.getAppsByStatus("PENDING");

        logger.info("Pending apps fetched successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/apps/all")
    public ResponseEntity<List<DeveloperAppResponse>> getAllApps() {

        logger.info("Fetching all apps");

        List<DeveloperAppResponse> response = developerService.getAllApps();

        logger.info("All apps fetched successfully");
        return ResponseEntity.ok(response);
    }
}