package com.campusnest.student;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.student.dto.StudentDtos.StudentProfileRequest;
import com.campusnest.student.dto.StudentDtos.StudentProfileResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    public StudentProfileResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return studentService.getProfile(principal);
    }

    @PutMapping("/me")
    public StudentProfileResponse update(@AuthenticationPrincipal UserPrincipal principal,
                                         @Valid @RequestBody StudentProfileRequest request) {
        return studentService.updateProfile(principal, request);
    }
}
