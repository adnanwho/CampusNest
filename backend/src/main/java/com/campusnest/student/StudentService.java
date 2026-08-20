package com.campusnest.student;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.common.TagUtils;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.User;
import com.campusnest.repository.StudentProfileRepository;
import com.campusnest.repository.UserRepository;
import com.campusnest.student.dto.StudentDtos.StudentProfileRequest;
import com.campusnest.student.dto.StudentDtos.StudentProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public StudentProfileResponse getProfile(UserPrincipal principal) {
        return toResponse(principal.getId());
    }

    @Transactional
    public StudentProfileResponse updateProfile(UserPrincipal principal, StudentProfileRequest request) {
        if (request.getBudgetMin() > request.getBudgetMax()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "budgetMin cannot be greater than budgetMax");
        }
        StudentProfile profile = studentProfileRepository.findByUserId(principal.getId())
                .orElseGet(() -> StudentProfile.builder().userId(principal.getId()).build());
        profile.setCollege(request.getCollege());
        profile.setBudgetMin(request.getBudgetMin());
        profile.setBudgetMax(request.getBudgetMax());
        profile.setMoveInDate(request.getMoveInDate());
        profile.setLocalityPref(request.getLocalityPref());
        profile.setAccommodationType(request.getAccommodationType());
        profile.setLifestyleTags(TagUtils.joinTags(request.getLifestyleTags()));
        studentProfileRepository.save(profile);
        return toResponse(principal.getId());
    }

    private StudentProfileResponse toResponse(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> StudentProfile.builder().userId(userId).build());
        StudentProfileResponse response = new StudentProfileResponse();
        response.setUserId(userId);
        response.setName(user.getName());
        response.setCollege(profile.getCollege());
        response.setBudgetMin(profile.getBudgetMin());
        response.setBudgetMax(profile.getBudgetMax());
        response.setMoveInDate(profile.getMoveInDate());
        response.setLocalityPref(profile.getLocalityPref());
        response.setAccommodationType(profile.getAccommodationType());
        response.setLifestyleTags(TagUtils.parseTags(profile.getLifestyleTags()));
        return response;
    }
}
