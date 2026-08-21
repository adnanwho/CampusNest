package com.campusnest.property;

import com.campusnest.auth.UserPrincipal;
import com.campusnest.model.Property;
import com.campusnest.model.User;
import com.campusnest.model.UserRole;
import com.campusnest.model.VerificationStatus;
import com.campusnest.property.dto.PropertyDtos.CompareItemDto;
import com.campusnest.recommendation.RecommendationService;
import com.campusnest.repository.PropertyRepository;
import com.campusnest.repository.ReviewRepository;
import com.campusnest.repository.StudentProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceCompareTest {

    @Mock PropertyRepository propertyRepository;
    @Mock ReviewRepository reviewRepository;
    @Mock StudentProfileRepository studentProfileRepository;
    @Mock PropertyMapper propertyMapper;
    @Mock RecommendationService recommendationService;

    @InjectMocks
    PropertyService propertyService;

    private UserPrincipal user(Long id) {
        User user = User.builder()
                .id(id)
                .name("Test User")
                .email("test@example.com")
                .passwordHash("encoded")
                .role(UserRole.STUDENT)
                .build();
        return new UserPrincipal(user);
    }

    @Test
    void compareRejectsNullIds() {
        assertThatThrownBy(() -> propertyService.compare(user(1L), null))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    void compareRejectsSingleId() {
        assertThatThrownBy(() -> propertyService.compare(user(1L), List.of(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    void compareRejectsFourIds() {
        assertThatThrownBy(() -> propertyService.compare(user(1L), List.of(1L, 2L, 3L, 4L)))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    void compareRejectsWhenNotEnoughUsableProperties() {
        Property verified = Property.builder().id(1L).verificationStatus(VerificationStatus.VERIFIED).available(5).build();
        Property draft = Property.builder().id(2L).verificationStatus(VerificationStatus.DRAFT).available(5).build();

        when(propertyRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(verified, draft));
        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.compare(user(1L), List.of(1L, 2L)))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST))
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getReason()).contains("at least 2"));
    }

    @Test
    void compareRejectsWhenNoPropertiesAvailable() {
        Property verifiedFull = Property.builder().id(1L).verificationStatus(VerificationStatus.VERIFIED).available(0).build();
        Property verifiedFull2 = Property.builder().id(2L).verificationStatus(VerificationStatus.VERIFIED).available(0).build();

        when(propertyRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(verifiedFull, verifiedFull2));
        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.compare(user(1L), List.of(1L, 2L)))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST))
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getReason()).contains("at least 2"));
    }

    @Test
    void compareSucceedsWithTwoUsableProperties() {
        Property p1 = Property.builder().id(1L).verificationStatus(VerificationStatus.VERIFIED).available(5).build();
        Property p2 = Property.builder().id(2L).verificationStatus(VerificationStatus.VERIFIED).available(3).build();

        when(propertyRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(p1, p2));
        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(recommendationService.score(any(), any())).thenReturn(85);
        when(propertyMapper.toCompareItem(any(), anyInt())).thenReturn(CompareItemDto.builder().build());

        List<CompareItemDto> result = propertyService.compare(user(1L), List.of(1L, 2L));
        assertThat(result).hasSize(2);
    }
}
