package com.example.portofolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 🔥 CONFIGURARE PENTRU DEVELOPMENT - permite totul
    @Bean
    @Profile("dev")
    public SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // Dezactivează CSRF pentru dev
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()   // Permite toate request-urile
                );

        return http.build();
    }

    // 🔒 CONFIGURARE PENTRU PRODUCTION - securitate activă
    @Bean
    @Profile({"prod", "test"})
    public SecurityFilterChain prodSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/actuator/**")  // Permite actuator
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/actuator/health",
                                "/api/v3/api-docs/**",
                                "/api/swagger-ui/**",
                                "/api/swagger-ui.html"
                        ).permitAll()
                        .anyRequest().authenticated()  // Restul necesită autentificare
                );

        return http.build();
    }
}