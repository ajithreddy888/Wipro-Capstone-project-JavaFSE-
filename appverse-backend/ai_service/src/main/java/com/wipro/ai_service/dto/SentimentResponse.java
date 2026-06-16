package com.wipro.ai_service.dto;

public class SentimentResponse {

    private String sentiment;
    private int predictedRating;
    private boolean isFakeLikely;

    public SentimentResponse() {}

    public SentimentResponse(String sentiment, int predictedRating, boolean isFakeLikely) {
        this.sentiment = sentiment;
        this.predictedRating = predictedRating;
        this.isFakeLikely = isFakeLikely;
    }

    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public int getPredictedRating() { return predictedRating; }
    public void setPredictedRating(int predictedRating) { this.predictedRating = predictedRating; }

    public boolean isFakeLikely() { return isFakeLikely; }
    public void setFakeLikely(boolean fakeLikely) { isFakeLikely = fakeLikely; }
}
