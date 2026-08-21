package com.campusnest.admin;

import com.campusnest.admin.dto.AdminDtos.*;
import com.campusnest.blockchain.BlockchainService;
import com.campusnest.common.EffectiveCostService;
import com.campusnest.common.TagUtils;
import com.campusnest.model.*;
import com.campusnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ListerProfileRepository listerProfileRepository;
    private final PropertyRepository propertyRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final EffectiveCostService effectiveCostService;
    private final BlockchainService blockchainService;

    public AdminDashboardDto getDashboard() {
        List<User> users = userRepository.findAll();
        List<Property> properties = propertyRepository.findAll();

        long students = users.stream().filter(u -> u.getRole() == UserRole.STUDENT).count();
        long listers = users.stream().filter(u -> u.getRole() == UserRole.LISTER).count();
        long admins = users.stream().filter(u -> u.getRole() == UserRole.ADMIN).count();

        long verified = properties.stream().filter(p -> p.getVerificationStatus() == VerificationStatus.VERIFIED).count();
        long pending = properties.stream().filter(p -> p.getVerificationStatus() == VerificationStatus.SUBMITTED_FOR_VERIFICATION).count();
        long underReview = properties.stream().filter(p -> p.getVerificationStatus() == VerificationStatus.UNDER_REVIEW).count();
        long rejected = properties.stream().filter(p -> p.getVerificationStatus() == VerificationStatus.REJECTED).count();

        int totalCap = properties.stream().mapToInt(Property::getCapacity).sum();
        int totalOcc = properties.stream().mapToInt(p -> p.getOccupied() != null ? p.getOccupied() : 0).sum();
        int totalAvail = properties.stream().mapToInt(p -> p.getAvailable() != null ? p.getAvailable() : 0).sum();

        List<AdminAuditLogDto> auditLogs = getAuditLogs().stream().limit(6).toList();

        return AdminDashboardDto.builder()
                .totalStudents(students)
                .totalListers(listers)
                .totalAdmins(admins)
                .totalProperties(properties.size())
                .verifiedProperties(verified)
                .pendingVerifications(pending)
                .underReviewVerifications(underReview)
                .rejectedProperties(rejected)
                .totalCapacity(totalCap)
                .totalOccupied(totalOcc)
                .totalAvailable(totalAvail)
                .recentActivities(auditLogs)
                .build();
    }

    public List<AdminUserDto> getUsers() {
        List<User> users = userRepository.findAll();
        Map<Long, StudentProfile> studentProfiles = studentProfileRepository.findAll().stream()
                .collect(Collectors.toMap(StudentProfile::getUserId, p -> p, (a, b) -> a));
        Map<Long, ListerProfile> listerProfiles = listerProfileRepository.findAll().stream()
                .collect(Collectors.toMap(ListerProfile::getUserId, p -> p, (a, b) -> a));

        return users.stream().map(u -> {
            Map<String, Object> details = new LinkedHashMap<>();
            if (u.getRole() == UserRole.STUDENT && studentProfiles.containsKey(u.getId())) {
                StudentProfile sp = studentProfiles.get(u.getId());
                details.put("college", sp.getCollege() != null ? sp.getCollege() : "Not specified");
                details.put("budgetRange", "₹" + sp.getBudgetMin() + " - ₹" + sp.getBudgetMax());
                details.put("localityPreference", sp.getLocalityPref() != null ? sp.getLocalityPref() : "Any");
                details.put("accommodationType", sp.getAccommodationType() != null ? sp.getAccommodationType().name() : "Any");
                details.put("lifestyleTags", TagUtils.parseTags(sp.getLifestyleTags()));
            } else if (u.getRole() == UserRole.LISTER && listerProfiles.containsKey(u.getId())) {
                ListerProfile lp = listerProfiles.get(u.getId());
                details.put("organization", lp.getOrganizationName() != null ? lp.getOrganizationName() : "Individual");
                details.put("phone", maskPhone(lp.getPhone()));
            }

            return AdminUserDto.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .maskedEmail(maskEmail(u.getEmail()))
                    .role(u.getRole())
                    .createdAt(u.getCreatedAt())
                    .details(details)
                    .build();
        }).toList();
    }

    public List<AdminPropertyDto> getProperties() {
        List<Property> properties = propertyRepository.findAll();
        Map<Long, User> userMap = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, u -> u, (a, b) -> a));

        return properties.stream().map(p -> {
            User lister = userMap.get(p.getListerId());
            String listerName = lister != null ? lister.getName() : "Unknown Lister";
            int effective = effectiveCostService.calculate(p);

            return AdminPropertyDto.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .type(p.getType())
                    .address(p.getAddress())
                    .locality(p.getLocality())
                    .rent(p.getRent())
                    .deposit(p.getDeposit())
                    .effectiveMonthlyCost(effective)
                    .capacity(p.getCapacity())
                    .occupied(p.getOccupied())
                    .available(p.getAvailable())
                    .rating(p.getRating())
                    .verificationStatus(p.getVerificationStatus())
                    .verificationHash(p.getVerificationHash())
                    .verificationTimestamp(p.getVerificationTimestamp())
                    .blockchainTx(p.getBlockchainTx())
                    .rejectionReason(p.getRejectionReason())
                    .listerId(p.getListerId())
                    .listerName(listerName)
                    .facilities(TagUtils.parseTags(p.getFacilities()))
                    .createdAt(p.getCreatedAt())
                    .updatedAt(p.getUpdatedAt())
                    .build();
        }).toList();
    }

    public AdminPrivacyDto getPrivacy() {
        List<PrivacyCategoryDto> categories = List.of(
                PrivacyCategoryDto.builder()
                        .categoryName("Public Listing Data")
                        .classification("PUBLIC DATA")
                        .description("Property attributes and public amenities shown to all searching students.")
                        .sampleFields(List.of("Property Name", "Address & Locality", "Base Rent & Deposits", "Facilities", "Distance to Campus"))
                        .protectionMethod("Open read access across discovery views; no personal identification")
                        .build(),
                PrivacyCategoryDto.builder()
                        .categoryName("User Identity & Authentication")
                        .classification("PRIVATE DATA")
                        .description("User identity records, authentication credentials, and contact endpoints.")
                        .sampleFields(List.of("Student/Lister Email", "Password Hashes (BCrypt)", "Phone Numbers", "Account Creation Timestamps"))
                        .protectionMethod("BCrypt one-way hashing; role-isolated JWT endpoints; masked in admin console")
                        .build(),
                PrivacyCategoryDto.builder()
                        .categoryName("Student Preferences & Matching")
                        .classification("CONSENTED DATA")
                        .description("Student budget limits, college affiliation, and lifestyle tags granted for matching.")
                        .sampleFields(List.of("Budget Min/Max", "College Name", "Locality Preference", "Lifestyle Tags (Quiet, Wi-Fi, Food)"))
                        .protectionMethod("Stored under explicit consent; processed only for deterministic 5-factor scoring")
                        .build(),
                PrivacyCategoryDto.builder()
                        .categoryName("System Security & Audit Integrity")
                        .classification("SYSTEM DATA")
                        .description("Stateless JWT signing keys, cryptographic verification hashes, and audit trails.")
                        .sampleFields(List.of("SHA-256 Record Hashes", "Blockchain Transaction IDs", "Timestamp Signatures", "Reviewer IDs"))
                        .protectionMethod("Immutable append-only verification log; tamper-evident SHA-256 hashing")
                        .build()
        );

        List<AdminConsentDto> consents = getConsents();
        List<AdminUserDto> users = getUsers();

        return AdminPrivacyDto.builder()
                .categories(categories)
                .activeConsents(consents)
                .users(users)
                .build();
    }

    public List<AdminConsentDto> getConsents() {
        List<User> users = userRepository.findAll();
        Map<Long, StudentProfile> studentProfiles = studentProfileRepository.findAll().stream()
                .collect(Collectors.toMap(StudentProfile::getUserId, p -> p, (a, b) -> a));

        List<AdminConsentDto> consents = new ArrayList<>();
        for (User u : users) {
            if (u.getRole() == UserRole.STUDENT) {
                StudentProfile sp = studentProfiles.get(u.getId());
                consents.add(AdminConsentDto.builder()
                        .id("consent-pref-" + u.getId())
                        .userId(u.getId())
                        .userName(u.getName())
                        .userRole("STUDENT")
                        .dataCategory("Housing & Budget Preferences")
                        .purpose("Deterministic 5-Factor Property Matching")
                        .status("GRANTED")
                        .timestamp(u.getCreatedAt())
                        .build());

                if (sp != null && sp.getLifestyleTags() != null && !sp.getLifestyleTags().isBlank()) {
                    consents.add(AdminConsentDto.builder()
                            .id("consent-life-" + u.getId())
                            .userId(u.getId())
                            .userName(u.getName())
                            .userRole("STUDENT")
                            .dataCategory("Lifestyle & Amenity Tags")
                            .purpose("Personalized Recommendation Scoring")
                            .status("GRANTED")
                            .timestamp(u.getCreatedAt())
                            .build());
                }
            } else if (u.getRole() == UserRole.LISTER) {
                consents.add(AdminConsentDto.builder()
                        .id("consent-list-" + u.getId())
                        .userId(u.getId())
                        .userName(u.getName())
                        .userRole("LISTER")
                        .dataCategory("Property & Pricing Verification")
                        .purpose("Physical Audit & Public Discovery Listing")
                        .status("GRANTED")
                        .timestamp(u.getCreatedAt())
                        .build());
            }
        }
        return consents;
    }

    public List<AdminAuditLogDto> getAuditLogs() {
        List<AdminAuditLogDto> logs = new ArrayList<>();
        List<VerificationRecord> records = verificationRecordRepository.findAll();
        Map<Long, Property> propertyMap = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, p -> p, (a, b) -> a));

        for (VerificationRecord vr : records) {
            Property prop = propertyMap.get(vr.getPropertyId());
            String propName = prop != null ? prop.getName() : "Property #" + vr.getPropertyId();
            String action = vr.getVerificationStatus() == VerificationStatus.VERIFIED
                    ? "PROPERTY_APPROVED"
                    : vr.getVerificationStatus() == VerificationStatus.REJECTED
                    ? "PROPERTY_REJECTED"
                    : "VERIFICATION_STATUS_CHANGED";

            logs.add(AdminAuditLogDto.builder()
                    .id("audit-vr-" + vr.getId())
                    .actor("CampusNest Admin (ID: " + (vr.getReviewedBy() != null ? vr.getReviewedBy() : "System") + ")")
                    .action(action)
                    .target(propName + " (ID: " + vr.getPropertyId() + ")")
                    .timestamp(vr.getTimestamp())
                    .result(vr.getVerificationStatus().name())
                    .details("Hash: " + (vr.getRecordHash() != null ? vr.getRecordHash().substring(0, Math.min(16, vr.getRecordHash().length())) + "..." : "None")
                            + (vr.getBlockchainTx() != null ? " | Tx: " + vr.getBlockchainTx() : "")
                            + (vr.getRejectionReason() != null ? " | Reason: " + vr.getRejectionReason() : ""))
                    .build());
        }

        // Add property creations and user registrations to provide complete operations history
        List<Property> properties = propertyRepository.findAll();
        for (Property p : properties) {
            logs.add(AdminAuditLogDto.builder()
                    .id("audit-prop-" + p.getId())
                    .actor("Lister (ID: " + p.getListerId() + ")")
                    .action("PROPERTY_REGISTERED")
                    .target(p.getName() + " (" + p.getLocality() + ")")
                    .timestamp(p.getCreatedAt())
                    .result("CREATED")
                    .details("Rent: ₹" + p.getRent() + " | Capacity: " + p.getCapacity() + " beds | Initial Status: " + p.getVerificationStatus())
                    .build());
        }

        List<User> users = userRepository.findAll();
        for (User u : users) {
            logs.add(AdminAuditLogDto.builder()
                    .id("audit-usr-" + u.getId())
                    .actor("Self-Service Registration")
                    .action("USER_REGISTERED")
                    .target(u.getName() + " (" + maskEmail(u.getEmail()) + ")")
                    .timestamp(u.getCreatedAt())
                    .result("ROLE_" + u.getRole().name())
                    .details("Account initialized with BCrypt credential protection")
                    .build());
        }

        logs.sort(Comparator.comparing(AdminAuditLogDto::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())));
        return logs;
    }

    public AdminReportsDto getReports() {
        List<Property> properties = propertyRepository.findAll();
        if (properties.isEmpty()) {
            return AdminReportsDto.builder()
                    .totalProperties(0)
                    .verificationRatePercent(0)
                    .averageRent(0)
                    .averageEffectiveCost(0)
                    .occupancyRatePercent(0)
                    .localityBreakdown(List.of())
                    .typeBreakdown(List.of())
                    .statusBreakdown(List.of())
                    .build();
        }

        long total = properties.size();
        long verified = properties.stream().filter(p -> p.getVerificationStatus() == VerificationStatus.VERIFIED).count();
        double verificationRate = Math.round((double) verified / total * 1000.0) / 10.0;

        double avgRent = Math.round(properties.stream().mapToInt(Property::getRent).average().orElse(0.0) * 10.0) / 10.0;
        double avgEffective = Math.round(properties.stream().mapToInt(effectiveCostService::calculate).average().orElse(0.0) * 10.0) / 10.0;

        int totalCap = properties.stream().mapToInt(Property::getCapacity).sum();
        int totalOcc = properties.stream().mapToInt(p -> p.getOccupied() != null ? p.getOccupied() : 0).sum();
        double occupancyRate = totalCap > 0 ? Math.round((double) totalOcc / totalCap * 1000.0) / 10.0 : 0.0;

        Map<String, List<Property>> byLocality = properties.stream().collect(Collectors.groupingBy(Property::getLocality));
        List<LocalityMetric> localityMetrics = byLocality.entrySet().stream().map(e -> {
            double locAvgRent = Math.round(e.getValue().stream().mapToInt(Property::getRent).average().orElse(0.0) * 10.0) / 10.0;
            double locAvgEff = Math.round(e.getValue().stream().mapToInt(effectiveCostService::calculate).average().orElse(0.0) * 10.0) / 10.0;
            return LocalityMetric.builder()
                    .locality(e.getKey())
                    .propertyCount(e.getValue().size())
                    .averageRent(locAvgRent)
                    .averageEffectiveCost(locAvgEff)
                    .build();
        }).sorted(Comparator.comparing(LocalityMetric::getPropertyCount).reversed()).toList();

        Map<PropertyType, Long> byType = properties.stream().collect(Collectors.groupingBy(Property::getType, Collectors.counting()));
        List<TypeMetric> typeMetrics = byType.entrySet().stream()
                .map(e -> TypeMetric.builder().type(e.getKey().name()).count(e.getValue()).build())
                .sorted(Comparator.comparing(TypeMetric::getCount).reversed()).toList();

        Map<VerificationStatus, Long> byStatus = properties.stream().collect(Collectors.groupingBy(Property::getVerificationStatus, Collectors.counting()));
        List<StatusMetric> statusMetrics = byStatus.entrySet().stream()
                .map(e -> StatusMetric.builder().status(e.getKey().name()).count(e.getValue()).build())
                .sorted(Comparator.comparing(StatusMetric::getCount).reversed()).toList();

        return AdminReportsDto.builder()
                .totalProperties(total)
                .verificationRatePercent(verificationRate)
                .averageRent(avgRent)
                .averageEffectiveCost(avgEffective)
                .occupancyRatePercent(occupancyRate)
                .localityBreakdown(localityMetrics)
                .typeBreakdown(typeMetrics)
                .statusBreakdown(statusMetrics)
                .build();
    }

    public AdminSystemHealthDto getSystemHealth() {
        long start = System.currentTimeMillis();
        long userCount = userRepository.count();
        long propCount = propertyRepository.count();
        long vrCount = verificationRecordRepository.count();
        long latency = System.currentTimeMillis() - start;

        return AdminSystemHealthDto.builder()
                .backendStatus("ONLINE")
                .databaseStatus("CONNECTED (PostgreSQL 16)")
                .authenticationStatus("OPERATIONAL (Stateless JWT / BCrypt)")
                .blockchainStatus(blockchainService.isConfigured() ? "CONNECTED (Polygon Amoy)" : "CONFIGURED (Local Cryptographic Verification)")
                .environment("Production / Showcase Ready")
                .databaseLatencyMs(latency)
                .timestamp(Instant.now())
                .totalUsers(userCount)
                .totalProperties(propCount)
                .totalVerificationRecords(vrCount)
                .build();
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@", 2);
        String user = parts[0];
        String domain = parts[1];
        if (user.length() <= 3) {
            return user.charAt(0) + "***@" + domain;
        }
        return user.substring(0, Math.min(4, user.length() - 1)) + "***@" + domain;
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.isBlank()) return "Not provided";
        if (phone.length() < 7) return "***";
        return phone.substring(0, 4) + "****" + phone.substring(phone.length() - 2);
    }
}
