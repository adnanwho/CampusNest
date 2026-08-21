package com.campusnest.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void allowsRegistrationButProtectsStudentRoutes() throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Security Test Student",
                                  "email": "security-test-student@campusnest.test",
                                  "password": "student123",
                                  "role": "STUDENT"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/students/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsAdminSelfRegistration() throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Unauthorized Admin",
                                  "email": "unauthorized-admin@campusnest.test",
                                  "password": "admin123",
                                  "role": "ADMIN"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void keepsVerificationLookupPublic() throws Exception {
        mockMvc.perform(get("/verification/999999"))
                .andExpect(status().isNotFound());
    }
}