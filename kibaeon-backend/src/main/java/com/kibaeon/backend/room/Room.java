package com.kibaeon.backend.room;

import com.kibaeon.backend.user.CharacterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room implements Serializable {
    private String roomId;
    private String roomName;
    private String hostId;
    private String hostNickname; // 방장 닉네임 추가

    private List<String> playerIds;
    private int maxPlayers;

    private Map<String, String> playerNicknames;       // userId -> nickname
    private Map<String, Boolean> readyStatus;
    private Map<String, CharacterType> playerCharacters;

    private boolean privateRoom;
    private String password;

    private RoomStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime startedAt;

    // 방 만들기 생성자
    public Room(String roomId, String roomName, String hostId, String hostNickname, int maxPlayers, boolean privateRoom, String password) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.hostId = hostId;
        this.hostNickname = hostNickname;
        this.playerIds = new ArrayList<>();
        this.playerIds.add(hostId);
        this.maxPlayers = maxPlayers;
        this.playerNicknames = new HashMap<>();
        this.playerNicknames.put(hostId, hostNickname);
        this.readyStatus = new HashMap<>();
        this.readyStatus.put(hostId, false);

        this.playerCharacters = new HashMap<>();
        this.privateRoom = privateRoom;
        this.password = password;
        this.status = RoomStatus.WAITING;
        this.createdAt = LocalDateTime.now();
        this.startedAt = null;
    }

    // 방이 가득 찼는지 확인
    public boolean isFull() {
        return playerIds.size() >= maxPlayers;
    }

    // 방장 제외 모두 준비 상태인지
    public boolean isAllReady() {
        return readyStatus.entrySet().stream()
                .filter(entry -> !entry.getKey().equals(hostId))
                .allMatch(Map.Entry::getValue);
    }

    // 강퇴
    public void kickPlayer(String playerId) {
        if (playerId.equals(hostId)) {
            throw new IllegalArgumentException("방장은 강퇴할 수 없어요.");
        }
        playerIds.remove(playerId);
        readyStatus.remove(playerId);
        playerCharacters.remove(playerId);
    }

    // 방장 위임
    public void transferHost(String newHostId) {
        if (!playerIds.contains(newHostId)) {
            throw new IllegalArgumentException("이미 방에 없는 사람이에요.");
        }
        this.hostId = newHostId;
    }
}
