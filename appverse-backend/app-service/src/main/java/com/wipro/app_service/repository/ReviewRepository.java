package com.wipro.app_service.repository;

import com.wipro.app_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAppId(Long appId);
    List<Review> findByUserId(Long userId);
}
