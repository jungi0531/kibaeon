package com.kibaeon.backend.room.dto;

import com.kibaeon.backend.room.Room;
import com.kibaeon.backend.room.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomListResponse {
    private String roomId;
    private String roomName;
    private String hostId;
    private String hostNickname;

    private List<String> playerIds;
    private int maxPlayers;

    private boolean privateRoom;  // 비공개 방 여부만 표시, 비밀번호는 숨김
    private RoomStatus status;

    private LocalDateTime createdAt;

    // Room 엔티티를 RoomListResponse로 변환
    public static RoomListResponse fromRoom(Room room) {
        return new RoomListResponse(
                room.getRoomId(),
                room.getRoomName(),
                room.getHostId(),
                room.getHostNickname(),
                room.getPlayerIds(),
                room.getMaxPlayers(),
                room.isPrivateRoom(),
                room.getStatus(),
                room.getCreatedAt()
        );
    }
}
