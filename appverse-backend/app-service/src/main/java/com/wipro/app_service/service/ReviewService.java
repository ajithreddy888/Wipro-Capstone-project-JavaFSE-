package com.wipro.app_service.service;

import com.wipro.app_service.dto.ReviewRequest;
import com.wipro.app_service.entity.Review;
import com.wipro.app_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(ReviewRequest request, Long userId, String userName) {
        Review review = new Review();
        review.setAppId(request.getAppId());
        review.setUserId(userId);
        review.setUserName(userName);
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setSentiment("PENDING");
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByApp(Long appId) {
        return reviewRepository.findByAppId(appId);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
}
