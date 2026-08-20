package com.campusnest.student.dto;

import com.campusnest.model.AccommodationType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class StudentDtos {

    @Data
    public static class StudentProfileRequest {
        @NotBlank
        private String college;

        @NotNull
        @Min(0)
        private Integer budgetMin;

        @NotNull
        @Min(0)
        private Integer budgetMax;

        private LocalDate moveInDate;

        private String localityPref;

        private AccommodationType accommodationType;

        private List<String> lifestyleTags;
    }

    @Data
    public static class StudentProfileResponse {
        private Long userId;
        private String name;
        private String college;
        private Integer budgetMin;
        private Integer budgetMax;
        private LocalDate moveInDate;
        private String localityPref;
        private AccommodationType accommodationType;
        private List<String> lifestyleTags;
    }

    @Data
    public static class PropertySearchParams {
        private Integer budgetMin;
        private Integer budgetMax;
        private String locality;
        private AccommodationType type;
    }
}
