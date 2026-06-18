package com.wipro.app_service.controller;


import com.wipro.app_service.dto.AppRequest;
import com.wipro.app_service.dto.AppResponse;
import com.wipro.app_service.service.AppService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apps")
public class AppController {

    private static final Logger logger = LoggerFactory.getLogger(AppController.class);

    @Autowired
    private AppService appService;

    @PostMapping("/add")
    public ResponseEntity<AppResponse> addApp(@RequestBody AppRequest request) {

        logger.info("Received request to add app: {}", request.getName());

        ResponseEntity<AppResponse> response =
                ResponseEntity.ok(appService.addApp(request));

        logger.info("App added successfully: {}", request.getName());

        return response;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppResponse>> getAllApps() {

        logger.info("Fetching all apps");

        ResponseEntity<List<AppResponse>> response =
                ResponseEntity.ok(appService.getAllApps());

        logger.info("Successfully fetched all apps");

        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppResponse> getAppById(@PathVariable Long id) {

        logger.info("Fetching app with id: {}", id);

        ResponseEntity<AppResponse> response =
                ResponseEntity.ok(appService.getAppById(id));

        logger.info("Successfully fetched app with id: {}", id);

        return response;
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AppResponse>> getByCategory(@PathVariable String category) {

        logger.info("Fetching apps for category: {}", category);

        ResponseEntity<List<AppResponse>> response =
                ResponseEntity.ok(appService.getAppsByCategory(category));

        logger.info("Successfully fetched apps for category: {}", category);

        return response;
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppResponse>> search(@RequestParam String name) {

        logger.info("Searching apps with name: {}", name);

        ResponseEntity<List<AppResponse>> response =
                ResponseEntity.ok(appService.searchApps(name));

        logger.info("Search completed for name: {}", name);

        return response;
    }

    @GetMapping("/developer/{developerId}")
    public ResponseEntity<List<AppResponse>> getByDeveloper(@PathVariable Long developerId) {

        logger.info("Fetching apps for developerId: {}", developerId);

        ResponseEntity<List<AppResponse>> response =
                ResponseEntity.ok(appService.getAppsByDeveloper(developerId));

        logger.info("Successfully fetched apps for developerId: {}", developerId);

        return response;
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadApp(@PathVariable Long id,
                                                Authentication authentication) {

        Long userId = authentication != null ? (Long) authentication.getPrincipal() : 0L;

        logger.info("User {} requested download for app {}", userId, id);

        appService.incrementDownload(id, userId);

        String dummyContent = "This is a dummy APK file for app ID: " + id
                + "\nAppVerse Platform - Demo Download";

        byte[] bytes = dummyContent.getBytes();

        ByteArrayResource resource = new ByteArrayResource(bytes);

        logger.info("Download prepared successfully for app {}", id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=app-" + id + ".apk")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(bytes.length)
                .body(resource);
    }

    @GetMapping("/my-downloads")
    public ResponseEntity<List<String>> getMyDownloads(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();

        logger.info("Fetching downloaded apps for user {}", userId);

        ResponseEntity<List<String>> response =
                ResponseEntity.ok(appService.getUserDownloadedAppNames(userId));

        logger.info("Successfully fetched downloaded apps for user {}", userId);

        return response;
    }

    @GetMapping("/my-download-ids")
    public ResponseEntity<List<Long>> getMyDownloadIds(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();

        logger.info("Fetching downloaded app IDs for user {}", userId);

        ResponseEntity<List<Long>> response =
                ResponseEntity.ok(appService.getUserDownloadedAppIds(userId));

        logger.info("Successfully fetched download IDs for user {}", userId);

        return response;
    }

    @DeleteMapping("/remove-by-name")
    public ResponseEntity<String> removeByName(@RequestParam String name) {

        logger.info("Removing app with name: {}", name);

        appService.removeByName(name);

        logger.info("Successfully removed app: {}", name);

        return ResponseEntity.ok("Removed");
    }

    @PutMapping("/update-by-name")
    public ResponseEntity<String> updateByName(@RequestParam String name,
                                               @RequestBody AppRequest request) {

        logger.info("Updating app with name: {}", name);

        appService.updateByName(name, request);

        logger.info("Successfully updated app: {}", name);

        return ResponseEntity.ok("Updated");
    }
}