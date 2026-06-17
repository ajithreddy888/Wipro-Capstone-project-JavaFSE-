package com.wipro.developer_service.controller;

import com.wipro.developer_service.dto.DeveloperAppRequest;
import com.wipro.developer_service.dto.DeveloperAppResponse;
import com.wipro.developer_service.entity.AppVersion;
import com.wipro.developer_service.service.DeveloperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/developer")
public class DeveloperController {

    @Autowired
    private DeveloperService developerService;

    @PostMapping("/apps/create")
    public ResponseEntity<DeveloperAppResponse> createApp(
            @RequestBody DeveloperAppRequest request,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(developerService.createApp(request, developerId));
    }

    @GetMapping("/apps/my")
    public ResponseEntity<List<DeveloperAppResponse>> getMyApps(Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(developerService.getMyApps(developerId));
    }

    @GetMapping("/apps/{id}")
    public ResponseEntity<DeveloperAppResponse> getAppById(@PathVariable Long id) {
        return ResponseEntity.ok(developerService.getAppById(id));
    }

    @PutMapping("/apps/{id}/submit")
    public ResponseEntity<DeveloperAppResponse> submitForReview(
            @PathVariable Long id,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(developerService.submitForReview(id, developerId));
    }

    @PutMapping("/apps/{id}/update")
    public ResponseEntity<DeveloperAppResponse> updateApp(
            @PathVariable Long id,
            @RequestBody DeveloperAppRequest request,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(developerService.updateApp(id, request, developerId));
    }

    @PutMapping("/apps/{id}/new-version")
    public ResponseEntity<DeveloperAppResponse> releaseNewVersion(
            @PathVariable Long id,
            @RequestParam String newVersion,
            @RequestParam String releaseNotes,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(
                developerService.releaseNewVersion(id, newVersion, releaseNotes, developerId));
    }

    @DeleteMapping("/apps/{id}/delete")
    public ResponseEntity<String> deleteApp(
            @PathVariable Long id,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        developerService.deleteApp(id, developerId);
        return ResponseEntity.ok("App deleted successfully");
    }

    @PutMapping("/apps/{id}/unpublish")
    public ResponseEntity<DeveloperAppResponse> unpublishApp(
            @PathVariable Long id,
            Authentication authentication) {
        Long developerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(developerService.unpublishApp(id, developerId));
    }

    @GetMapping("/apps/{id}/versions")
    public ResponseEntity<List<AppVersion>> getVersionHistory(@PathVariable Long id) {
        return ResponseEntity.ok(developerService.getVersionHistory(id));
    }

    @GetMapping("/apps/published")
    public ResponseEntity<List<DeveloperAppResponse>> getAllPublished() {
        return ResponseEntity.ok(developerService.getAllPublishedApps());
    }

    @PutMapping("/admin/apps/{id}/approve")
    public ResponseEntity<DeveloperAppResponse> approveApp(@PathVariable Long id) {
        return ResponseEntity.ok(developerService.approveApp(id));
    }

    @PutMapping("/admin/apps/{id}/block")
    public ResponseEntity<DeveloperAppResponse> blockApp(@PathVariable Long id) {
        return ResponseEntity.ok(developerService.blockApp(id));
    }

    @GetMapping("/admin/apps/pending")
    public ResponseEntity<List<DeveloperAppResponse>> getPendingApps() {
        return ResponseEntity.ok(developerService.getAppsByStatus("PENDING"));
    }

    @GetMapping("/admin/apps/all")
    public ResponseEntity<List<DeveloperAppResponse>> getAllApps() {
        return ResponseEntity.ok(developerService.getAllApps());
    }
}