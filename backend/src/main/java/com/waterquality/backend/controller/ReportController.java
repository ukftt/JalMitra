package com.waterquality.backend.controller;

import com.waterquality.backend.dto.ReportRequest;
import com.waterquality.backend.entity.Report;
import com.waterquality.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}")
    public Report getReport(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    // POST /api/reports — citizen submits a new report (JSON body)
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody ReportRequest request) {
        Report saved = reportService.createReport(
                request.getLat(),
                request.getLng(),
                request.getIssueType(),
                request.getDescription(),
                request.getWard(),
                null   // no photo on this JSON endpoint
        );
        return ResponseEntity.status(201).body(saved);
    }

    @PatchMapping("/{id}/status")
    public Report updateStatus(@PathVariable Long id,
                               @RequestParam String status,
                               @RequestParam(required = false) String note,
                               @RequestParam Long officialId) {
        return reportService.updateStatus(id, status, note, officialId);
    }
}