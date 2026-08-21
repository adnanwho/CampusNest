package com.campusnest.admin;

import com.campusnest.admin.dto.AdminDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardDto dashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/users")
    public List<AdminUserDto> users() {
        return adminService.getUsers();
    }

    @GetMapping("/properties")
    public List<AdminPropertyDto> properties() {
        return adminService.getProperties();
    }

    @GetMapping("/privacy")
    public AdminPrivacyDto privacy() {
        return adminService.getPrivacy();
    }

    @GetMapping("/consent")
    public List<AdminConsentDto> consent() {
        return adminService.getConsents();
    }

    @GetMapping("/audit-logs")
    public List<AdminAuditLogDto> auditLogs() {
        return adminService.getAuditLogs();
    }

    @GetMapping("/reports")
    public AdminReportsDto reports() {
        return adminService.getReports();
    }

    @GetMapping("/system-health")
    public AdminSystemHealthDto systemHealth() {
        return adminService.getSystemHealth();
    }
}
