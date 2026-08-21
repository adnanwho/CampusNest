package com.campusnest.config;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.campusnest.blockchain.BlockchainService;
import com.campusnest.common.AvailabilityService;
import com.campusnest.model.AccommodationType;
import com.campusnest.model.ListerProfile;
import com.campusnest.model.Property;
import com.campusnest.model.PropertyType;
import com.campusnest.model.Review;
import com.campusnest.model.StudentProfile;
import com.campusnest.model.User;
import com.campusnest.model.UserRole;
import com.campusnest.model.VerificationRecord;
import com.campusnest.model.VerificationStatus;
import com.campusnest.repository.ListerProfileRepository;
import com.campusnest.repository.PropertyRepository;
import com.campusnest.repository.ReviewRepository;
import com.campusnest.repository.StudentProfileRepository;
import com.campusnest.repository.UserRepository;
import com.campusnest.repository.VerificationRecordRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ListerProfileRepository listerProfileRepository;
    private final PropertyRepository propertyRepository;
    private final ReviewRepository reviewRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final AvailabilityService availabilityService;
    private final BlockchainService blockchainService;
    private Long adminUserId;

    @Value("${campusnest.admin.email}")
    private String adminEmail;

    @Value("${campusnest.admin.password}")
    private String adminPassword;

    @Value("${campusnest.admin.name}")
    private String adminName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        if (propertyRepository.count() == 0) {
            seedProperties();
        }
    }

    private void seedUsers() {
        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> userRepository.save(User.builder()
                .name(adminName)
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(UserRole.ADMIN)
                .build()));
        this.adminUserId = admin.getId();

        User lister = userRepository.findByEmail("lister@campusnest.demo").orElseGet(() -> userRepository.save(User.builder()
                .name("CampusNest Demo Lister")
                .email("lister@campusnest.demo")
                .passwordHash(passwordEncoder.encode("lister123"))
                .role(UserRole.LISTER)
                .build()));
        listerProfileRepository.findByUserId(lister.getId()).orElseGet(() -> listerProfileRepository.save(ListerProfile.builder()
                .userId(lister.getId())
                .organizationName("CampusNest Partner Homes")
                .phone("+91-9876543210")
                .build()));

        createStudent("aarav@campusnest.demo", "Aarav Sharma", "NIET", 6000, 8000, "Knowledge Park", AccommodationType.PG, "Safety,Food Quality,Quiet Environment", "aarav");
        createStudent("priya@campusnest.demo", "Priya Patel", "Sharda University", 9000, 13000, "Knowledge Park III", AccommodationType.HOSTEL, "Wi-Fi,Cleanliness,Safety", "priya");
        createStudent("rohan@campusnest.demo", "Rohan Verma", "Galgotias University", 5000, 7000, "Knowledge Park", AccommodationType.PG, "Proximity to Market,Wi-Fi,Budget-friendly", "rohan");
    }

    private void createStudent(String email, String name, String college, int min, int max, String locality,
                               AccommodationType type, String tags, String goldenKey) {
        User user = userRepository.findByEmail(email).orElseGet(() -> userRepository.save(User.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode("student123"))
                .role(UserRole.STUDENT)
                .build()));
        studentProfileRepository.findByUserId(user.getId()).orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                .userId(user.getId())
                .college(college)
                .budgetMin(min)
                .budgetMax(max)
                .moveInDate(LocalDate.now().plusDays(20))
                .localityPref(locality)
                .accommodationType(type)
                .lifestyleTags(tags)
                .goldenProfileKey(goldenKey)
                .build()));
    }

    private void seedProperties() {
        User lister = userRepository.findByEmail("lister@campusnest.demo").orElseThrow();
        List<Property> properties = List.of(
                property(lister, "Stanza Living Kyoto House", PropertyType.PG, "Knowledge Park III, Greater Noida", "Knowledge Park III", 9500, 15000, 1200, 300, 500, 300, 30, 18, 1.8, 8, "Walk", 4.6, VerificationStatus.VERIFIED, "WiFi,Meals Included,CCTV/Security,Laundry,Housekeeping", "Verified student PG near NIET and Sharda with food quality and safety focus."),
                property(lister, "Your-Space Hostel Greater Noida", PropertyType.HOSTEL, "Knowledge Park II, Greater Noida", "Knowledge Park II", 11000, 18000, 1500, 400, 500, 400, 48, 34, 2.4, 12, "E-rickshaw", 4.4, VerificationStatus.VERIFIED, "WiFi,AC,Meals Included,Power Backup,CCTV/Security", "Managed hostel near Galgotias with reliable WiFi and meal plan."),
                property(lister, "Scholar Nest PG for Boys", PropertyType.PG, "Alpha 1, Greater Noida", "Alpha 1", 7200, 10000, 900, 250, 400, 250, 20, 14, 2.1, 10, "Walk", 4.2, VerificationStatus.VERIFIED, "WiFi,Meals Included,CCTV/Security,Power Backup", "Budget PG near NIET with quiet study friendly rooms."),
                property(lister, "Zolo Silicon Valley", PropertyType.PG, "Sector 62, Noida", "Sector 62", 8500, 12000, 1000, 300, 500, 300, 36, 22, 6.8, 28, "Metro", 4.3, VerificationStatus.VERIFIED, "WiFi,AC,Laundry,Housekeeping,Power Backup", "Noida PG with strong connectivity and managed facilities."),
                property(lister, "Aura Student Residencies", PropertyType.HOSTEL, "Pari Chowk, Greater Noida", "Pari Chowk", 12500, 20000, 1800, 500, 600, 500, 60, 46, 4.2, 18, "Bus", 4.5, VerificationStatus.VERIFIED, "WiFi,AC,Meals Included,Laundry,CCTV/Security,Parking", "Premium student residence with high safety and food quality."),
                property(lister, "Campus Haven Girls PG", PropertyType.PG, "Knowledge Park III, Greater Noida", "Knowledge Park III", 6800, 10000, 900, 250, 400, 250, 24, 17, 1.2, 6, "Walk", 4.7, VerificationStatus.VERIFIED, "WiFi,Meals Included,CCTV/Security,Housekeeping", "Girls PG near Sharda with safety, cleanliness, and quiet environment."),
                property(lister, "Green View 2BHK Flatshare", PropertyType.FLAT, "Gamma 2, Greater Noida", "Gamma 2", 6000, 12000, 0, 600, 400, 600, 4, 2, 5.0, 20, "Bike", 4.0, VerificationStatus.VERIFIED, "WiFi,Parking,Power Backup", "Shared flat for independent students looking for lower rent."),
                property(lister, "Metro Pride Student PG", PropertyType.PG, "Sector 52, Noida", "Sector 52", 7500, 12000, 800, 300, 500, 300, 28, 19, 7.3, 32, "Metro", 4.1, VerificationStatus.VERIFIED, "WiFi,Laundry,Housekeeping,CCTV/Security", "Noida PG close to metro and markets."),
                property(lister, "The Elite Residency", PropertyType.PG, "Beta 1, Greater Noida", "Beta 1", 9000, 15000, 1200, 300, 500, 300, 30, 20, 3.8, 16, "E-rickshaw", 4.0, VerificationStatus.UNDER_REVIEW, "WiFi,AC,Meals Included,CCTV/Security", "Pending admin verification."),
                property(lister, "Apex Luxury Hostel", PropertyType.HOSTEL, "Knowledge Park I, Greater Noida", "Knowledge Park I", 14000, 22000, 1800, 500, 600, 600, 70, 51, 2.9, 13, "Bus", 4.6, VerificationStatus.VERIFIED, "WiFi,AC,Meals Included,Laundry,Power Backup,CCTV/Security,Parking", "Premium hostel near Bennett with rich amenities."),
                property(lister, "Budget Stay Dorms", PropertyType.HOSTEL, "Jagat Farm, Greater Noida", "Jagat Farm", 4500, 7000, 700, 200, 300, 200, 40, 35, 3.5, 15, "E-rickshaw", 3.8, VerificationStatus.DRAFT, "WiFi,Meals Included", "Low-cost dormitory listing still in draft."),
                property(lister, "Comfort Zone 3BHK Shared", PropertyType.SHARED_ACCOMMODATION, "Chi 4, Greater Noida", "Chi 4", 5500, 10000, 0, 600, 400, 500, 6, 4, 6.0, 24, "Bike", 4.1, VerificationStatus.VERIFIED, "WiFi,Parking,Power Backup,Housekeeping", "Shared apartment for budget-conscious students."),
                property(lister, "Shree Balaji Boys PG", PropertyType.PG, "Knowledge Park III, Greater Noida", "Knowledge Park III", 7000, 10000, 900, 250, 400, 250, 20, 18, 1.0, 5, "Walk", 4.8, VerificationStatus.VERIFIED, "WiFi,Meals Included,CCTV/Security,Power Backup,Housekeeping", "Live demo property near NIET with 18 of 20 beds occupied."),
                property(lister, "NestAway Urban Living", PropertyType.SHARED_ACCOMMODATION, "Sector 128, Noida", "Sector 128", 10500, 18000, 0, 700, 500, 700, 8, 5, 8.5, 35, "Metro", 4.2, VerificationStatus.VERIFIED, "WiFi,AC,Laundry,Parking,Power Backup", "Shared urban living with strong Noida connectivity."),
                property(lister, "Grand Plaza Student Suites", PropertyType.HOSTEL, "Alpha 2, Greater Noida", "Alpha 2", 8000, 14000, 1000, 300, 400, 300, 44, 29, 2.8, 14, "E-rickshaw", 4.0, VerificationStatus.SUBMITTED_FOR_VERIFICATION, "WiFi,Meals Included,CCTV/Security,Laundry", "Submitted for admin verification.")
        );

        propertyRepository.saveAll(properties).forEach(this::seedReviewsAndVerification);
    }

    private Property property(User lister, String name, PropertyType type, String address, String locality, int rent,
                              int deposit, int food, int electricity, int wifi, int maintenance, int capacity,
                              int occupied, double distance, int commute, String commuteMode, double rating,
                              VerificationStatus status, String facilities, String description) {
        Property property = Property.builder()
                .listerId(lister.getId())
                .name(name)
                .type(type)
                .address(address)
                .locality(locality)
                .description(description)
                .latitude(28.4744 + (distance / 100))
                .longitude(77.5040 + (distance / 100))
                .rent(rent)
                .deposit(deposit)
                .foodCost(food)
                .electricityCost(electricity)
                .wifiCost(wifi)
                .maintenanceCost(maintenance)
                .facilities(facilities)
                .distanceKm(distance)
                .commuteTimeMin(commute)
                .commuteMode(commuteMode)
                .capacity(capacity)
                .occupied(occupied)
                .rating(rating)
                .verificationStatus(status)
                .build();
        availabilityService.refreshAvailability(property);
        return property;
    }

    private void seedReviewsAndVerification(Property property) {
        reviewRepository.saveAll(List.of(
                Review.builder()
                        .propertyId(property.getId())
                        .rating(Math.min(5.0, property.getRating() + 0.1))
                        .cleanlinessRating(4.3)
                        .safetyRating(4.5)
                        .foodRating(4.1)
                        .wifiRating(4.2)
                        .staffRating(4.2)
                        .reviewText("Demo review: clean rooms, responsive staff, and practical commute for students.")
                        .isDemo(true)
                        .build(),
                Review.builder()
                        .propertyId(property.getId())
                        .rating(property.getRating())
                        .cleanlinessRating(4.1)
                        .safetyRating(4.4)
                        .foodRating(4.0)
                        .wifiRating(4.3)
                        .staffRating(4.0)
                        .reviewText("Demo review: good value for the effective monthly cost and nearby student facilities.")
                        .isDemo(true)
                        .build()
        ));

        if (property.getVerificationStatus() == VerificationStatus.VERIFIED) {
            Instant timestamp = Instant.now();
<<<<<<< HEAD
            String hash = blockchainService.computeRecordHash(
                    property.getId(), property.getListerId(), timestamp.toString(), VerificationStatus.VERIFIED.name(),
                    property.getAddress(), property.getCapacity(), null);
=======
            String hash = blockchainService.computeCanonicalHash(property, String.valueOf(adminUserId), VerificationStatus.VERIFIED, timestamp);
>>>>>>> origin/main
            property.setVerificationHash(hash);
            property.setVerificationTimestamp(timestamp);
            property.setBlockchainTx("mock-seed-" + Math.abs(property.getName().hashCode()));
            propertyRepository.save(property);

            verificationRecordRepository.save(VerificationRecord.builder()
                    .propertyId(property.getId())
                    .listerId(property.getListerId())
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .recordHash(hash)
                    .timestamp(timestamp)
                    .blockchainTx(property.getBlockchainTx())
                    .build());
        }
    }
}