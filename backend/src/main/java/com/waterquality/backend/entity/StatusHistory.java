package com.waterquality.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "status_history")
@Data
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "changed_by")
    private Long changedBy;   // the official's user ID

    @Column(name = "old_status", length = 30)
    private String oldStatus;

    @Column(name = "new_status", length = 30)
    private String newStatus;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "changed_at")
    private LocalDateTime changedAt = LocalDateTime.now();
}
