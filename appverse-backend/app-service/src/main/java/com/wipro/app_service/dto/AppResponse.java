package com.wipro.app_service.dto;

public class AppResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String developerName;
    private double averageRating;
    private int totalDownloads;
    private String status;
    private String imageUrl;

    public AppResponse(Long id, String name, String description,
                       String category, String developerName,
                       double averageRating, int totalDownloads,
                       String status, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.developerName = developerName;
        this.averageRating = averageRating;
        this.totalDownloads = totalDownloads;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDeveloperName() { return developerName; }
    public void setDeveloperName(String developerName) { this.developerName = developerName; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public int getTotalDownloads() { return totalDownloads; }
    public void setTotalDownloads(int totalDownloads) { this.totalDownloads = totalDownloads; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
