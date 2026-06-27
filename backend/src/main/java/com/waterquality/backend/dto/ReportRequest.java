package com.waterquality.backend.dto;

import lombok.Data;

@Data
public class ReportRequest {
    private Double lat;
    private Double lng;
    private String issueType;
    private String description;
    private String ward;
}