package com.waterquality.backend.repository;


import com.waterquality.backend.entity.Upvote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpvoteRepository extends JpaRepository<Upvote,Long> {
    // Check if this IP already voted on this report
    boolean existsByReportIdAndIpAddress(Long reportId, String ipAddress);

    // Count votes for a report
    long countByReportId(Long reportId);


}
