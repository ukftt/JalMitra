package com.waterquality.backend.service;

import com.waterquality.backend.entity.Upvote;
import com.waterquality.backend.entity.Report;
import com.waterquality.backend.repository.UpvoteRepository;
import com.waterquality.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpvoteService {

    private final UpvoteRepository upvoteRepository;
    private final ReportRepository reportRepository;

    @Transactional  // Both DB operations succeed or both fail together
    public String upvoteReport(Long reportId, String ipAddress) {

        // Check duplicate vote
        if (upvoteRepository.existsByReportIdAndIpAddress(reportId, ipAddress)) {
            return "ALREADY_VOTED";
        }

        // Save the upvote record
        Upvote upvote = new Upvote();
        upvote.setReportId(reportId);
        upvote.setIpAddress(ipAddress);
        upvoteRepository.save(upvote);

        // Increment counter on the report
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setUpvotes(report.getUpvotes() + 1);
        reportRepository.save(report);

        return "UPVOTED";
    }
}