package com.waterquality.backend.service;

import com.waterquality.backend.entity.EscalationLog;
import com.waterquality.backend.entity.Report;
import com.waterquality.backend.repository.EscalationLogRepository;
import com.waterquality.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EscalationService {

    private final ReportRepository reportRepository;
    private final EscalationLogRepository escalationLogRepository;
    private final JavaMailSender mailSender;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void checkAndEscalate() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<Report> reports = reportRepository.findReportsNeedingEscalation(cutoff);

        for (Report report : reports) {
            // Skip if already escalated
            if (escalationLogRepository.existsByReportId(report.getId())) continue;

            // Send email to ward officer
            sendEscalationEmail(report);

            // Log it
            EscalationLog log = new EscalationLog();
            log.setReportId(report.getId());
            log.setEmailSentTo("officer-" + report.getWard() + "@municipality.gov.in");
            escalationLogRepository.save(log);
        }
    }

    private void sendEscalationEmail(Report report) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("officer-" + report.getWard() + "@municipality.gov.in");
        message.setSubject("URGENT: Unresolved Water Issue in " + report.getWard());
        message.setText(
                "Report ID: " + report.getId() + "\n" +
                        "Issue: " + report.getIssueType() + "\n" +
                        "Upvotes: " + report.getUpvotes() + "\n" +
                        "Location: " + report.getLat() + ", " + report.getLng() + "\n" +
                        "Reported on: " + report.getCreatedAt() + "\n\n" +
                        "This issue has not been acknowledged for 7+ days."
        );
        mailSender.send(message);
    }
}