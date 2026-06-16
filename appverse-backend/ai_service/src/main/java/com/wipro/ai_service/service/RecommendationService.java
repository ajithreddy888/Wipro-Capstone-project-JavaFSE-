package com.wipro.ai_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wipro.ai_service.dto.RecommendationRequest;
import com.wipro.ai_service.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private GeminiClient geminiClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecommendationResponse getRecommendations(RecommendationRequest request) {
        String prompt = """
                You are an app recommendation engine.
                User has downloaded these apps: %s
                Available apps in marketplace: %s
                Recommend the top 5 most relevant apps from the available list based on similarity.
                Respond ONLY with a raw JSON array of app names and strict to purely relavant if not reply one app.
                No markdown, no explanation, no backticks.
                Example output: ["App1","App2","App3","App4","App5"]
                """.formatted(
                String.join(", ", request.getDownloadedApps()),
                String.join(", ", request.getAvailableApps())
        );

        try {
            String raw = geminiClient.ask(prompt);
            System.out.println("Gemini raw response: " + raw);

            // Clean any markdown fences
            String cleaned = raw.replace("```json", "")
                                .replace("```", "")
                                .trim();

            // Use Jackson to parse the array properly
            String[] apps = objectMapper.readValue(cleaned, String[].class);
            return new RecommendationResponse(Arrays.asList(apps));

        } catch (Exception e) {
            System.out.println("Gemini recommendation failed: " + e.getMessage());
            // Fallback
            List<String> fallback = request.getAvailableApps().stream()
                    .limit(5)
                    .collect(Collectors.toList());
            return new RecommendationResponse(fallback);
        }
    }
}