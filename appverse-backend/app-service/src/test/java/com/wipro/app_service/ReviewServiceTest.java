package com.wipro.app_service;



import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.wipro.app_service.dto.ReviewRequest;
import com.wipro.app_service.entity.Review;
import com.wipro.app_service.repository.ReviewRepository;
import com.wipro.app_service.service.ReviewService;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review review;
    private ReviewRequest request;

    @BeforeEach
    void setUp() {

        request = new ReviewRequest();
        request.setAppId(1L);
        request.setComment("Excellent App");
        request.setRating(5);

        review = new Review();
        review.setId(1L);
        review.setAppId(1L);
        review.setUserId(100L);
        review.setUserName("Ajith");
        review.setComment("Excellent App");
        review.setRating(5);
        review.setSentiment("PENDING");
    }

    @Test
    void testAddReview() {

        when(reviewRepository.save(any(Review.class)))
                .thenReturn(review);

        Review savedReview =
                reviewService.addReview(request, 100L, "Ajith");

        assertNotNull(savedReview);
        assertEquals(1L, savedReview.getId());
        assertEquals("Excellent App", savedReview.getComment());
        assertEquals("PENDING", savedReview.getSentiment());

        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void testGetReviewsByApp() {

        when(reviewRepository.findByAppId(1L))
                .thenReturn(Arrays.asList(review));

        assertEquals(1,
                reviewService.getReviewsByApp(1L).size());

        verify(reviewRepository).findByAppId(1L);
    }

    @Test
    void testGetReviewsByUser() {

        when(reviewRepository.findByUserId(100L))
                .thenReturn(Arrays.asList(review));

        assertEquals(1,
                reviewService.getReviewsByUser(100L).size());

        verify(reviewRepository).findByUserId(100L);
    }

    @Test
    void testAddReview_VerifyFields() {

        when(reviewRepository.save(any(Review.class)))
                .thenReturn(review);

        Review result =
                reviewService.addReview(request, 100L, "Ajith");

        assertEquals(1L, result.getAppId());
        assertEquals(100L, result.getUserId());
        assertEquals("Ajith", result.getUserName());
        assertEquals(5, result.getRating());
    }

    @Test
    void testGetReviewsByApp_EmptyList() {

        when(reviewRepository.findByAppId(10L))
                .thenReturn(Arrays.asList());

        assertTrue(
                reviewService.getReviewsByApp(10L).isEmpty()
        );
    }

    @Test
    void testGetReviewsByUser_EmptyList() {

        when(reviewRepository.findByUserId(200L))
                .thenReturn(Arrays.asList());

        assertTrue(
                reviewService.getReviewsByUser(200L).isEmpty()
        );
    }
}
