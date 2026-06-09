package com.waterquality.backend.controller;

import com.waterquality.backend.entity.Report;
import com.waterquality.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // GET /api/reports — fetch all reports for the map
    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    // GET /api/reports/{id} — fetch one report detail
    @GetMapping("/{id}")
    public Report getReport(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    // POST /api/reports — citizen submits a new report
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Report> createReport(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String issueType,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String ward,
            @RequestPart(required = false) MultipartFile photo) {
        Report saved = reportService.createReport(lat, lng, issueType, description, ward, photo);
        return ResponseEntity.status(201).body(saved);
    }

    // PATCH /api/reports/{id}/status — official updates status
    @PatchMapping("/{id}/status")
    public Report updateStatus(@PathVariable Long id,
                               @RequestParam String status,
                               @RequestParam(required = false) String note,
                               @RequestParam Long officialId) {
        return reportService.updateStatus(id, status, note, officialId);
    }
}