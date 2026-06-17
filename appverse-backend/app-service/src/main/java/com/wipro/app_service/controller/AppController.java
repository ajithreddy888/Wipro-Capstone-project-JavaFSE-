package com.wipro.app_service.controller;

import com.wipro.app_service.dto.AppRequest;
import com.wipro.app_service.dto.AppResponse;
import com.wipro.app_service.service.AppService;
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

    @Autowired
    private AppService appService;

    @PostMapping("/add")
    public ResponseEntity<AppResponse> addApp(@RequestBody AppRequest request) {
        return ResponseEntity.ok(appService.addApp(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppResponse>> getAllApps() {
        return ResponseEntity.ok(appService.getAllApps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppResponse> getAppById(@PathVariable Long id) {
        return ResponseEntity.ok(appService.getAppById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AppResponse>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(appService.getAppsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppResponse>> search(@RequestParam String name) {
        return ResponseEntity.ok(appService.searchApps(name));
    }

    @GetMapping("/developer/{developerId}")
    public ResponseEntity<List<AppResponse>> getByDeveloper(@PathVariable Long developerId) {
        return ResponseEntity.ok(appService.getAppsByDeveloper(developerId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadApp(@PathVariable Long id,
                                                Authentication authentication) {
        Long userId = authentication != null ? (Long) authentication.getPrincipal() : 0L;
        appService.incrementDownload(id, userId);

        String dummyContent = "This is a dummy APK file for app ID: " + id
                + "\nAppVerse Platform - Demo Download";
        byte[] bytes = dummyContent.getBytes();
        ByteArrayResource resource = new ByteArrayResource(bytes);

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
        return ResponseEntity.ok(appService.getUserDownloadedAppNames(userId));
    }

    @GetMapping("/my-download-ids")
    public ResponseEntity<List<Long>> getMyDownloadIds(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(appService.getUserDownloadedAppIds(userId));
    }

    @DeleteMapping("/remove-by-name")
    public ResponseEntity<String> removeByName(@RequestParam String name) {
        appService.removeByName(name);
        return ResponseEntity.ok("Removed");
    }

    @PutMapping("/update-by-name")
    public ResponseEntity<String> updateByName(@RequestParam String name,
                                               @RequestBody AppRequest request) {
        appService.updateByName(name, request);
        return ResponseEntity.ok("Updated");
    }
}