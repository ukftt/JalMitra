package com.waterquality.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "escalation_logs")
@Data
public class EscalationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "email_sent_to", length = 150)
    private String emailSentTo;

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();
}
