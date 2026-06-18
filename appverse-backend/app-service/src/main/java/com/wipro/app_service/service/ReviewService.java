package com.wipro.app_service.service;



import com.wipro.app_service.dto.ReviewRequest;
import com.wipro.app_service.entity.Review;
import com.wipro.app_service.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(ReviewRequest request, Long userId, String userName) {

        logger.info("Adding review for app {} by user {}", request.getAppId(), userId);

        Review review = new Review();
        review.setAppId(request.getAppId());
        review.setUserId(userId);
        review.setUserName(userName);
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setSentiment("PENDING");

        Review savedReview = reviewRepository.save(review);

        logger.info("Review added successfully with ID: {}", savedReview.getId());

        return savedReview;
    }

    public List<Review> getReviewsByApp(Long appId) {

        logger.info("Fetching reviews for app {}", appId);

        List<Review> reviews = reviewRepository.findByAppId(appId);

        logger.info("Retrieved {} reviews for app {}", reviews.size(), appId);

        return reviews;
    }

    public List<Review> getReviewsByUser(Long userId) {

        logger.info("Fetching reviews submitted by user {}", userId);

        List<Review> reviews = reviewRepository.findByUserId(userId);

        logger.info("Retrieved {} reviews submitted by user {}", reviews.size(), userId);

        return reviews;
    }
}