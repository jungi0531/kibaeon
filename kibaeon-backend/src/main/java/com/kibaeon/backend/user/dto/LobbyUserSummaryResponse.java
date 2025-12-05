package com.kibaeon.backend.user.dto;

import lombok.Getter;

@Getter
public class LobbyUserSummaryResponse {
    private String nickname;
    private Integer totalGames;
    private Integer winCount;
    private Double winRate;
}
