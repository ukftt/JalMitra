package com.waterquality.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "issue_type", nullable = false, length = 50)
    private String issueType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 30)
    private String status = "OPEN";

    private Integer upvotes = 0;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(length = 100)
    private String ward;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
