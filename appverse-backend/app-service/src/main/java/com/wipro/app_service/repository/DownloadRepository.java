package com.wipro.app_service.repository;

import com.wipro.app_service.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUserId(Long userId);
    List<Download> findByAppId(Long appId);
    boolean existsByUserIdAndAppId(Long userId, Long appId);
}
