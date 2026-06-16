package com.wipro.ai_service.controller;

import com.wipro.ai_service.dto.RecommendationRequest;
import com.wipro.ai_service.dto.RecommendationResponse;
import com.wipro.ai_service.dto.SentimentRequest;
import com.wipro.ai_service.dto.SentimentResponse;
import com.wipro.ai_service.service.RecommendationService;
import com.wipro.ai_service.service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private SentimentService sentimentService;

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/sentiment")
    public ResponseEntity<SentimentResponse> analyzeSentiment(
            @RequestBody SentimentRequest request) {
        return ResponseEntity.ok(sentimentService.analyzeSentiment(request));
    }

    @PostMapping("/recommend")
    public ResponseEntity<RecommendationResponse> getRecommendations(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.getRecommendations(request));
    }
}
