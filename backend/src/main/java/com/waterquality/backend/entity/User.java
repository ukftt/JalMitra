package com.waterquality.backend.entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length=20)
    private String role = "OFFICIAL";

    @Column(length = 100)
    private String ward;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
