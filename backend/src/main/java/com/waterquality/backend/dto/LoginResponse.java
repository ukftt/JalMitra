package com.waterquality.backend.dto;
import lombok.*;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String name;
    private String ward;
    private String role;
}