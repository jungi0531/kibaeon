package com.kibaeon.backend.room.dto;

import lombok.Data;

@Data
public class CreateRoomRequest {
    private String roomName;
    private int maxPlayers = 2;
    private boolean isPrivate = false;
    private String password;
}
