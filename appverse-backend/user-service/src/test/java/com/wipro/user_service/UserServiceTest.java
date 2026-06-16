package com.wipro.user_service;

import com.wipro.user_service.dto.LoginRequest;
import com.wipro.user_service.dto.LoginResponse;
import com.wipro.user_service.dto.RegisterRequest;
import com.wipro.user_service.entity.User;
import com.wipro.user_service.repo.UserRepository;
import com.wipro.user_service.security.JwtUtil;
import com.wipro.user_service.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private User ajithUser;
    private User googleUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        ajithUser = new User();
        ajithUser.setId(1L);
        ajithUser.setName("Ajith");
        ajithUser.setEmail("ajith@gmail.com");
        ajithUser.setPassword("$2a$10$hashedpassword_ajith");
        ajithUser.setRole("USER");
        ajithUser.setActive(true);

        googleUser = new User();
        googleUser.setId(2L);
        googleUser.setName("Google Dev");
        googleUser.setEmail("google@gmail.com");
        googleUser.setPassword("$2a$10$hashedpassword_google");
        googleUser.setRole("DEVELOPER");
        googleUser.setActive(true);

        adminUser = new User();
        adminUser.setId(3L);
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@test.com");
        adminUser.setPassword("$2a$10$hashedpassword_admin");
        adminUser.setRole("ADMIN");
        adminUser.setActive(true);
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Ajith");
        request.setEmail("ajith@gmail.com");
        request.setPassword("123");
        request.setRole("USER");

        when(userRepository.existsByEmail("ajith@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("$2a$10$hashedpassword_ajith");
        when(userRepository.save(any(User.class))).thenReturn(ajithUser);

        String result = userService.register(request);

        assertEquals("User registered successfully", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("ajith@gmail.com");
        request.setPassword("123");

        when(userRepository.existsByEmail("ajith@gmail.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.register(request));

        assertEquals("Email already registered", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Ajith_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ajith@gmail.com");
        request.setPassword("123");

        when(userRepository.findByEmail("ajith@gmail.com"))
                .thenReturn(Optional.of(ajithUser));
        when(passwordEncoder.matches("123", "$2a$10$hashedpassword_ajith"))
                .thenReturn(true);
        when(jwtUtil.generateToken(1L, "ajith@gmail.com", "USER"))
                .thenReturn("mock.jwt.token.ajith");

        LoginResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("USER", response.getRole());
        assertEquals(1L, response.getUserId());
        assertEquals("Ajith", response.getName());
        assertEquals("mock.jwt.token.ajith", response.getToken());
    }

    @Test
    void login_GoogleDev_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("google@gmail.com");
        request.setPassword("123456");

        when(userRepository.findByEmail("google@gmail.com"))
                .thenReturn(Optional.of(googleUser));
        when(passwordEncoder.matches("123456", "$2a$10$hashedpassword_google"))
                .thenReturn(true);
        when(jwtUtil.generateToken(2L, "google@gmail.com", "DEVELOPER"))
                .thenReturn("mock.jwt.token.google");

        LoginResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("DEVELOPER", response.getRole());
        assertEquals(2L, response.getUserId());
    }

    @Test
    void login_Admin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123456");

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("123456", "$2a$10$hashedpassword_admin"))
                .thenReturn(true);
        when(jwtUtil.generateToken(3L, "admin@test.com", "ADMIN"))
                .thenReturn("mock.jwt.token.admin");

        LoginResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("ADMIN", response.getRole());
        assertEquals("Admin User", response.getName());
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ajith@gmail.com");
        request.setPassword("wrongpass");

        when(userRepository.findByEmail("ajith@gmail.com"))
                .thenReturn(Optional.of(ajithUser));
        when(passwordEncoder.matches("wrongpass", "$2a$10$hashedpassword_ajith"))
                .thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("Invalid password", ex.getMessage());
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@gmail.com");
        request.setPassword("123456");

        when(userRepository.findByEmail("unknown@gmail.com"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void login_InactiveUser_ThrowsException() {
        ajithUser.setActive(false);

        LoginRequest request = new LoginRequest();
        request.setEmail("ajith@gmail.com");
        request.setPassword("123");

        when(userRepository.findByEmail("ajith@gmail.com"))
                .thenReturn(Optional.of(ajithUser));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("Account is deactivated", ex.getMessage());
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(ajithUser));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("Ajith", result.getName());
        assertEquals("ajith@gmail.com", result.getEmail());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.getUserById(99L));

        assertEquals("User not found", ex.getMessage());
    }
}