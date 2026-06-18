package com.wipro.user_service.controller;



import com.wipro.user_service.dto.LoginRequest;
import com.wipro.user_service.dto.LoginResponse;
import com.wipro.user_service.dto.RegisterRequest;
import com.wipro.user_service.entity.User;
import com.wipro.user_service.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        logger.info("POST /api/users/register called");

        String message = userService.register(request);

        logger.info("Registration completed successfully");

        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        logger.info("POST /api/users/login called");

        LoginResponse response = userService.login(request);

        logger.info("Login completed successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        logger.info("GET /api/users/{} called", id);

        User user = userService.getUserById(id);

        logger.info("User details returned successfully");

        return ResponseEntity.ok(user);
    }
}