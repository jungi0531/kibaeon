package com.kibaeon.backend.room.dto;

import lombok.Data;

@Data
public class JoinRoomRequest {
    private String password;  // 비공개 방일 경우에만 필요
}
