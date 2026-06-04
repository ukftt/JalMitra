package com.waterquality.backend.repository;

import com.waterquality.backend.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {

    // Get all status changes for one report, ordered by time
    List<StatusHistory> findByReportIdOrderByChangedAtAsc(Long reportId);
}
