package com.kibaeon.backend.user.dto;

import com.kibaeon.backend.user.CharacterType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSummaryInfoResponse {
    private String nickname;
    private Integer totalGames;
    private Integer winCount;
    private Double winRate;
    private CharacterType characterType;
}