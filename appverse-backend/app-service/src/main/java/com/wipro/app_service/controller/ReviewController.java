package com.wipro.app_service.controller;



import com.wipro.app_service.dto.ReviewRequest;
import com.wipro.app_service.entity.Review;
import com.wipro.app_service.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apps/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest request,
                                            Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();
        String userName = "User" + userId;

        logger.info("User {} is adding a review for app {}", userId, request.getAppId());

        ResponseEntity<Review> response =
                ResponseEntity.ok(reviewService.addReview(request, userId, userName));

        logger.info("Review added successfully by user {}", userId);

        return response;
    }

    @GetMapping("/app/{appId}")
    public ResponseEntity<List<Review>> getReviewsByApp(@PathVariable Long appId) {

        logger.info("Fetching reviews for app {}", appId);

        ResponseEntity<List<Review>> response =
                ResponseEntity.ok(reviewService.getReviewsByApp(appId));

        logger.info("Successfully fetched reviews for app {}", appId);

        return response;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {

        logger.info("Fetching reviews submitted by user {}", userId);

        ResponseEntity<List<Review>> response =
                ResponseEntity.ok(reviewService.getReviewsByUser(userId));

        logger.info("Successfully fetched reviews submitted by user {}", userId);

        return response;
    }
}