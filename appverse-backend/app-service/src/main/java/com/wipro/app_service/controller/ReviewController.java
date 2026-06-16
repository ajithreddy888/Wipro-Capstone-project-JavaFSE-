package com.wipro.app_service.controller;

import com.wipro.app_service.dto.ReviewRequest;
import com.wipro.app_service.entity.Review;
import com.wipro.app_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apps/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest request,
                                             Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        String userName = "User" + userId;
        return ResponseEntity.ok(reviewService.addReview(request, userId, userName));
    }

    @GetMapping("/app/{appId}")
    public ResponseEntity<List<Review>> getReviewsByApp(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.getReviewsByApp(appId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }
}
