package com.kibaeon.backend.user.dto;

import com.kibaeon.backend.user.User;
import com.kibaeon.backend.user.CharacterType;

public record UserResponse(
        Long id,
        String email,
        String nickname,
        CharacterType characterType,
        Integer totalGames,
        Integer winCount,
        Integer maxWpm,
        Double averageWpm
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getCharacterType(),
                user.getTotalGames(),
                user.getWinCount(),
                user.getMaxWpm(),
                user.getAverageWpm()
        );
    }
}
