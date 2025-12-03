package com.kibaeon.backend.user;

import com.kibaeon.backend.user.dto.LoginRequest;
import com.kibaeon.backend.user.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일이에요.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임이에요.");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .characterType(request.getCharacterType())
                .totalGames(0)
                .winCount(0)
                .maxWpm(0)
                .averageWpm(0.0)
                .build();

        userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일이에요."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않아요.");
        }

        return user;
    }

    public User findById(long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없어요."));
    }

    public boolean isEmailDuplicated(String email) {
        return userRepository.existsByEmail(email);
    }
}
