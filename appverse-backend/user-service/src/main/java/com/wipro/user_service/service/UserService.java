package com.wipro.user_service.service;



import com.wipro.user_service.dto.LoginRequest;
import com.wipro.user_service.dto.LoginResponse;
import com.wipro.user_service.dto.RegisterRequest;
import com.wipro.user_service.entity.User;
import com.wipro.user_service.repo.UserRepository;
import com.wipro.user_service.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(RegisterRequest request) {

        logger.info("Registration request received for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "USER");
        user.setActive(true);

        userRepository.save(user);

        logger.info("User registered successfully with email: {}", user.getEmail());

        return "User registered successfully";
    }

    public LoginResponse login(LoginRequest request) {

        logger.info("Login request received for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.error("Login failed. User not found: {}", request.getEmail());
                    return new RuntimeException("User not found");
                });

        if (!user.isActive()) {
            logger.warn("Login failed. Account deactivated for email: {}", request.getEmail());
            throw new RuntimeException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed. Invalid password for email: {}", request.getEmail());
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        logger.info("User logged in successfully. User ID: {}, Role: {}", user.getId(), user.getRole());

        return new LoginResponse(token, user.getRole(), user.getId(), user.getName());
    }

    public User getUserById(Long id) {

        logger.info("Fetching user details for ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", id);
                    return new RuntimeException("User not found");
                });

        logger.info("User details retrieved successfully for ID: {}", id);

        return user;
    }
}