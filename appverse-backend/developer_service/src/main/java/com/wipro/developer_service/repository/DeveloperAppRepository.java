package com.wipro.developer_service.repository;

import com.wipro.developer_service.entity.DeveloperApp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeveloperAppRepository extends JpaRepository<DeveloperApp, Long> {
    List<DeveloperApp> findByDeveloperId(Long developerId);
    List<DeveloperApp> findByStatus(String status);
    List<DeveloperApp> findByDeveloperIdAndStatus(Long developerId, String status);
}
