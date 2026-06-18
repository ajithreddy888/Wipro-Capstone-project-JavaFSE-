package com.wipro.user_service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wipro.user_service.dto.LoginRequest;
import com.wipro.user_service.dto.LoginResponse;
import com.wipro.user_service.dto.RegisterRequest;
import com.wipro.user_service.entity.User;
import com.wipro.user_service.repo.UserRepository;
import com.wipro.user_service.security.JwtUtil;
import com.wipro.user_service.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setName("Ajith");
        user.setEmail("ajith@test.com");
        user.setPassword("encodedPassword");
        user.setRole("USER");
        user.setActive(true);

        registerRequest = new RegisterRequest();
        registerRequest.setName("Ajith");
        registerRequest.setEmail("ajith@test.com");
        registerRequest.setPassword("password");
        registerRequest.setRole("USER");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("ajith@test.com");
        loginRequest.setPassword("password");
    }

    @Test
    void testRegisterSuccess() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("encodedPassword");

        String result = userService.register(registerRequest);

        assertEquals("User registered successfully", result);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterEmailAlreadyExists() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.register(registerRequest));

        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void testLoginSuccess() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(true);

        when(jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()))
                .thenReturn("jwt-token");

        LoginResponse response = userService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("USER", response.getRole());
        assertEquals(1L, response.getUserId());
        assertEquals("Ajith", response.getName());
    }

    @Test
    void testLoginUserNotFound() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(loginRequest));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testLoginInactiveUser() {

        user.setActive(false);

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(loginRequest));

        assertEquals("Account is deactivated", exception.getMessage());
    }

    @Test
    void testLoginInvalidPassword() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(loginRequest));

        assertEquals("Invalid password", exception.getMessage());
    }

    @Test
    void testGetUserByIdSuccess() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Ajith", result.getName());
        assertEquals("ajith@test.com", result.getEmail());
    }

    @Test
    void testGetUserByIdNotFound() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.getUserById(1L));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testRegisterDefaultRole() {

        registerRequest.setRole(null);

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encodedPassword");

        userService.register(registerRequest);

        verify(userRepository).save(any(User.class));
    }
}