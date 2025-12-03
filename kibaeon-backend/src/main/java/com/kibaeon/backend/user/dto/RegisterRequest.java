package com.kibaeon.backend.user.dto;

import com.kibaeon.backend.user.CharacterType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class RegisterRequest {
    @Email(message = "이메일 형식이 올바르지 않아요.")
    @NotBlank(message = "이메일을 적어주세요")
    private String email;

    @NotBlank(message = "비밀번호를 적어주세요.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 ~ 20자 사이여야해요.")
    private String password;

    @NotBlank(message = "닉네임을 적어주세요.")
    @Size(min = 2, max = 10, message = "닉네임은 2자 ~ 10자 사이여야해요.")
    private String nickname;

    private CharacterType characterType;
}
