package com.campusnest.admin;

import com.campusnest.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "campusnest.jwt.secret=test-only-campusnest-jwt-secret-which-is-at-least-32-bytes")
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    void unauthenticatedAccessToAdminReturns401() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/admin/properties"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void studentAndListerAreForbiddenFromAdminEndpoints() throws Exception {
        String studentToken = loginToken("aarav@campusnest.demo", "student123");
        String listerToken = loginToken("lister@campusnest.demo", "lister123");

        mockMvc.perform(get("/admin/dashboard").header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/admin/dashboard").header("Authorization", "Bearer " + listerToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/admin/users").header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/admin/privacy").header("Authorization", "Bearer " + listerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanAccessAllAdminEndpoints() throws Exception {
        String adminToken = loginToken("admin@campusnest.demo", "admin123");

        mockMvc.perform(get("/admin/dashboard").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalStudents").isNumber())
                .andExpect(jsonPath("$.totalProperties").isNumber());

        mockMvc.perform(get("/admin/users").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].maskedEmail").exists())
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[0].passwordHash").doesNotExist());

        mockMvc.perform(get("/admin/properties").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/admin/privacy").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categories").isArray());

        mockMvc.perform(get("/admin/consent").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/admin/audit-logs").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/admin/reports").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verificationRatePercent").isNumber());

        mockMvc.perform(get("/admin/system-health").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.backendStatus").value("ONLINE"))
                .andExpect(jsonPath("$.databaseStatus").exists());
    }

    private String loginToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        return response.replaceFirst(".*\\\"token\\\":\\\"([^\\\"]+)\\\".*", "$1");
    }
}
