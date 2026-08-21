package com.campusnest.auth;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.campusnest.repository.UserRepository;

@SpringBootTest(properties = "campusnest.jwt.secret=test-only-campusnest-jwt-secret-which-is-at-least-32-bytes")
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

        @Test
        void studentAndListerCannotAccessAdminButAdminCan() throws Exception {
      String studentToken = loginToken("aarav@campusnest.demo", "student123");
      String listerToken = loginToken("lister@campusnest.demo", "lister123");
      String adminToken = loginToken("admin@campusnest.demo", "admin123");

      mockMvc.perform(get("/admin/verifications/pending").header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isForbidden());
      mockMvc.perform(get("/admin/verifications/pending").header("Authorization", "Bearer " + listerToken))
        .andExpect(status().isForbidden());
      mockMvc.perform(get("/admin/verifications/pending").header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());
        }

        @Test
        void rejectsInvalidJwtAndIncorrectPassword() throws Exception {
      mockMvc.perform(get("/students/me").header("Authorization", "Bearer invalid-token"))
        .andExpect(status().isUnauthorized());

      mockMvc.perform(post("/auth/login")
          .contentType(MediaType.APPLICATION_JSON)
          .content("""
            {
              "email": "aarav@campusnest.demo",
              "password": "wrong-password"
            }
            """))
        .andExpect(status().isUnauthorized());
        }

        @Test
        void storesRegisteredPasswordAsBcryptHash() throws Exception {
      String email = "password-test@campusnest.test";
      mockMvc.perform(post("/auth/register")
          .contentType(MediaType.APPLICATION_JSON)
          .content("""
            {
              "name": "Password Test Student",
              "email": "password-test@campusnest.test",
              "password": "plain-password",
              "role": "STUDENT"
            }
            """))
        .andExpect(status().isOk());

      var user = userRepository.findByEmail(email).orElseThrow();
      assertNotNull(user.getPasswordHash());
      assertFalse(user.getPasswordHash().equals("plain-password"));
      assertTrue(passwordEncoder.matches("plain-password", user.getPasswordHash()));
        }

        @Test
        void studentRegistrationFollowedByRecommendationsAndPropertiesSearch() throws Exception {
            String email = "fresh-student-" + System.currentTimeMillis() + "@campusnest.test";
            MvcResult regResult = mockMvc.perform(post("/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {
                                      "name": "Fresh Student",
                                      "email": "%s",
                                      "password": "student123",
                                      "role": "STUDENT"
                                    }
                                    """.formatted(email)))
                    .andExpect(status().isOk())
                    .andReturn();

            String response = regResult.getResponse().getContentAsString();
            String token = response.replaceFirst(".*\\\"token\\\":\\\"([^\\\"]+)\\\".*", "$1");

            mockMvc.perform(get("/recommendations").header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());

            mockMvc.perform(get("/properties").header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }

        private String loginToken(String email, String password) throws Exception {
      MvcResult result = mockMvc.perform(post("/auth/login")
          .contentType(MediaType.APPLICATION_JSON)
          .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
        .andExpect(status().isOk())
        .andReturn();
      String response = result.getResponse().getContentAsString();
      String token = response.replaceFirst(".*\\\"token\\\":\\\"([^\\\"]+)\\\".*", "$1");
      assertNotNull(token);
      return token;
        }
}