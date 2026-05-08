package com.example.Backend_2026.infrastructure.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
