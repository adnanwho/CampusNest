package com.campusnest.auth;

import com.campusnest.auth.dto.AuthResponse;
import com.campusnest.auth.dto.LoginRequest;
import com.campusnest.auth.dto.RegisterRequest;
import com.campusnest.model.ListerProfile;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.User;
import com.campusnest.model.UserRole;
import com.campusnest.repository.ListerProfileRepository;
import com.campusnest.repository.StudentProfileRepository;
import com.campusnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ListerProfileRepository listerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin registration is not allowed");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        if (request.getRole() == UserRole.STUDENT) {
            studentProfileRepository.save(StudentProfile.builder().userId(user.getId()).build());
        } else if (request.getRole() == UserRole.LISTER) {
            listerProfileRepository.save(ListerProfile.builder().userId(user.getId()).build());
        }

        UserPrincipal principal = new UserPrincipal(user);
        return AuthResponse.builder()
                .token(jwtService.generateToken(principal))
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        UserPrincipal principal = new UserPrincipal(user);
        return AuthResponse.builder()
                .token(jwtService.generateToken(principal))
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
