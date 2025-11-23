package com.kibaeon.backend.user.dto;

import com.kibaeon.backend.user.CharacterType;
import lombok.Getter;

@Getter
public class RegisterRequest {
    private String email;
    private String password;
    private String nickname;
    private CharacterType characterType;
}
