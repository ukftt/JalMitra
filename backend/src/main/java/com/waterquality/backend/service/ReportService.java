package com.waterquality.backend.service;

import com.waterquality.backend.entity.Report;
import com.waterquality.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final FileUploadService fileUploadService;
    private final StatusHistoryService statusHistoryService;

    // Create a new report (called when citizen submits the form)
    public Report createReport(Double lat, Double lng, String issueType,
                               String description, String ward,
                               MultipartFile photo) {
        Report report = new Report();
        report.setLat(lat);
        report.setLng(lng);
        report.setIssueType(issueType);
        report.setDescription(description);
        report.setWard(ward);

        // Save photo if provided
        if (photo != null && !photo.isEmpty()) {
            String photoUrl = fileUploadService.saveFile(photo);
            report.setPhotoUrl(photoUrl);
        }

        return reportRepository.save(report);
    }

    // Get all reports — used by the map on page load
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // Get one report by ID — used when citizen clicks a map pin
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found: " + id));
    }

    // Update status — called by municipality official
    public Report updateStatus(Long id, String newStatus, String note, Long officialId) {
        Report report = getReportById(id);
        String oldStatus = report.getStatus();
        report.setStatus(newStatus);
        Report saved = reportRepository.save(report);

        // Log the status change for audit trail
        statusHistoryService.logStatusChange(id, officialId, oldStatus, newStatus, note);
        return saved;
    }

    public List<Report> getReportsByWard(String ward) {
        return reportRepository.findByWard(ward);
    }
}