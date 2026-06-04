package com.waterquality.backend.repository;

import com.waterquality.backend.entity.EscalationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscalationLogRepository extends JpaRepository<EscalationLog, Long> {

    // Has an escalation email already been sent for this report?
    boolean existsByReportId(Long reportId);
}
