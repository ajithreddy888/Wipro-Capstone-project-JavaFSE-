package com.wipro.developer_service.repository;

import com.wipro.developer_service.entity.AppVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppVersionRepository extends JpaRepository<AppVersion, Long> {
    List<AppVersion> findByAppId(Long appId);
}
