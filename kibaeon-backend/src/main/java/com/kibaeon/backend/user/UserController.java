package com.kibaeon.backend.user;

import com.kibaeon.backend.config.JwtTokenProvider;
import com.kibaeon.backend.user.dto.UserSummaryInfoResponse;
import com.kibaeon.backend.user.dto.LoginRequest;
import com.kibaeon.backend.user.dto.RegisterRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);

        return ResponseEntity.ok("회원가입 성공");
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam @Email String email) {
        boolean duplicated = userService.isEmailDuplicated(email);
        return ResponseEntity.ok(duplicated);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.login(request);
        String token = jwtTokenProvider.createToken(user.getId());

        return ResponseEntity.ok(token);
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserSummaryInfoResponse> getUserSummaryInfo(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        UserSummaryInfoResponse response = userService.getUserSummaryInfo(userId);

        return ResponseEntity.ok(response);
    }
}
