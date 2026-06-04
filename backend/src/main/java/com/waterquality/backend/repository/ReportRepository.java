package com.waterquality.backend.repository;


import com.waterquality.backend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report,Long>{

    // Find all reports in a specific ward
    List<Report> findByWard(String ward);

    // Find all open reports (for escalation check)
    List<Report> findByStatus(String status);

    // Find reports that may need escalation:
    // upvotes >= 50 AND status is still OPEN AND created more than 7 days ago
    @Query("SELECT r FROM Report r WHERE r.upvotes >= 50 " +
            "AND r.status = 'OPEN' " +
            "AND r.createdAt <= :cutoffDate")
    List<Report> findReportsNeedingEscalation(LocalDateTime cutoffDate);

}
