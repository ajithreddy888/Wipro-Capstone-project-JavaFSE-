package com.wipro.app_service.repository;

import com.wipro.app_service.entity.App;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AppRepository extends JpaRepository<App, Long> {
    List<App> findByCategory(String category);
    List<App> findByNameContainingIgnoreCase(String name);
    List<App> findByDeveloperId(Long developerId);
    List<App> findByStatus(String status);
    Optional<App> findByName(String name);
}
