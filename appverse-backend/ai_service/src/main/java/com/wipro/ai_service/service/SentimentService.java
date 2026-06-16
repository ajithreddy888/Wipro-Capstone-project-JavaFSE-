package com.wipro.ai_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wipro.ai_service.dto.SentimentRequest;
import com.wipro.ai_service.dto.SentimentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SentimentService {

    @Autowired
    private GeminiClient geminiClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public SentimentResponse analyzeSentiment(SentimentRequest request) {
        String prompt = """
                Analyze this app review and respond ONLY with a JSON object.
                No markdown, no explanation, just raw JSON.
                Format: {"sentiment":"POSITIVE","predictedRating":4,"isFakeLikely":false}
                Sentiment must be one of: POSITIVE, NEGATIVE, NEUTRAL
                predictedRating must be 1 to 5
                isFakeLikely must be true or false
                Review: "%s"
                Given rating: %d
                """.formatted(request.getReviewText(), request.getRating());

        try {
            String raw = geminiClient.ask(prompt);
            String cleaned = raw.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(cleaned, SentimentResponse.class);
        } catch (Exception e) {
            // Fallback if Gemini fails
            return new SentimentResponse("NEUTRAL", request.getRating(), false);
        }
    }
}
