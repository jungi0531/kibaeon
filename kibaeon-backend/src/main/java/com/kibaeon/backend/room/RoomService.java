package com.kibaeon.backend.room;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String ROOM_KEY_PREFIX = "room:";

    // 방 생성
    public Room createRoom(String roomName, String hostId, int maxPlayers, boolean isPrivate, String password) {
        try {
            // UUID로 고유 방 id 만들기
            String roomId = UUID.randomUUID().toString();

            // 방 객체 생성 후 JSON 변환
            Room room = new Room(roomId, roomName, hostId, maxPlayers, isPrivate, password);
            String roomJson = objectMapper.writeValueAsString(room);

            String key = ROOM_KEY_PREFIX + roomId;
            redisTemplate.opsForValue().set(key, roomJson);

            return room;
        } catch (Exception e) {
            throw new RuntimeException("방 생성이 실패했어요. : " + e.getMessage(), e);
        }
    }

    // 방 목록 조회
    public List<Room> getAllRooms() {
        try {
            Set<String> keys = redisTemplate.keys(ROOM_KEY_PREFIX + "*");

            if (keys == null || keys.isEmpty()) {
                return new ArrayList<>();
            }

            return keys.stream()
                    .map(key -> {
                        try {
                            String roomJson = (String)redisTemplate.opsForValue().get(key);
                            return objectMapper.readValue(roomJson, Room.class);
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("방 목록 조회에 실패했어요. : " + e.getMessage(), e);
        }
    }

    // 방 삭제
    public void deleteRoom(String roomId, String userId) {
        try {
            String key = ROOM_KEY_PREFIX + roomId;

            // 방 존재 여부 확인
            String roomJson = (String)redisTemplate.opsForValue().get(key);
            if (roomJson == null) {
                throw new RuntimeException("존재하지 않는 방이에요");
            }

            // 방 정보 가져와서 방장인지 확인
            Room room = objectMapper.readValue(roomJson, Room.class);
            if (!room.getHostId().equals(userId)) {
                throw new RuntimeException("방장만 방을 삭제할 수 있어요.");
            }

            redisTemplate.delete(key);
        } catch (Exception e) {
            throw new RuntimeException("방 삭제에 실패했어요. : " + e.getMessage(), e);
        }
    }
}
