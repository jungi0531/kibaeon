package com.kibaeon.backend.room;

import com.kibaeon.backend.user.CharacterType;
import com.kibaeon.backend.user.User;
import com.kibaeon.backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
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
    @Autowired
    private UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String ROOM_KEY_PREFIX = "room:";
    private static final String USER_ROOM_KEY_PREFIX = "user:room:";

    // 유저의 방 ID 조회
    public String getCurrentRoomId(String userId) {
        return (String) redisTemplate.opsForValue().get(USER_ROOM_KEY_PREFIX + userId);
    }
    // 방 생성
    public Room createRoom(String roomName, String hostId, int maxPlayers, boolean isPrivate, String password) {
        try {
            // 이미 다른 방에 있는지 확인
            String currentRoomId = getCurrentRoomId(hostId);
            if (currentRoomId != null) {
                throw new RuntimeException("이미 다른 방에 입장해 있어요.");
            }

            // UUID로 고유 방 id 만들기
            String roomId = UUID.randomUUID().toString();

            // 방 객체 생성 후 JSON 변환
            Room room = new Room(roomId, roomName, hostId, maxPlayers, isPrivate, password);

            // 방장 정보 방에 추가
            User host = userService.findById(Long.parseLong(hostId));
            room.getPlayerIds().add(hostId);
            room.getReadyStatus().put(hostId, false);
            room.getPlayerCharacters().put(hostId, host.getCharacterType());

            String roomJson = objectMapper.writeValueAsString(room);
            String key = ROOM_KEY_PREFIX + roomId;

            redisTemplate.opsForValue().set(key, roomJson);
            redisTemplate.opsForValue().set(USER_ROOM_KEY_PREFIX + hostId, roomId);

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
    // 이 기능은 방장이 방 폭파를 위한 기능 프론트에 구현은 하지 않았지만 우선 남겨둠.
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

    // 방 입장
    public Room joinRoom(String roomId, String userId, String password) {
        try {
            // 이미 다른 방에 있는지 확인
            String currentRoomId = getCurrentRoomId(userId);
            if (currentRoomId != null) {
                throw new RuntimeException("이미 다른 방에 입장해 있어요.");
            }

            // 방 존재 여부 확인
            String key = ROOM_KEY_PREFIX + roomId;
            String roomJson = (String)redisTemplate.opsForValue().get(key);
            if (roomJson == null) {
                throw new RuntimeException("존재하지 않는 방이에요.");
            }

            Room room = objectMapper.readValue(roomJson, Room.class);

            if (room.isFull()) {
                throw new RuntimeException("방이 가득 찼어요.");
            }
            if (room.isPrivate()) {
                if (password == null || !password.equals(room.getPassword())) {
                    throw new RuntimeException("비밀번호가 틀렸어요.");
                }
            }

            // 유저 정보 가져오기
            User user = userService.findById(Long.parseLong(userId));
            CharacterType characterType = user.getCharacterType();

            // 방에 유저 정보 추가
            room.getPlayerIds().add(userId);
            room.getReadyStatus().put(userId, false);
            room.getPlayerCharacters().put(userId, characterType);

            // 변경 정보 redis에 저장
            redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(room));
            redisTemplate.opsForValue().set(USER_ROOM_KEY_PREFIX + userId, roomId);

            return room;
        } catch (Exception e) {
            throw new RuntimeException("방 입장에 실패했어요. :" + e.getMessage(), e);
        }
    }

    // 방 나가기
    public void leaveRoom(String roomId, String userId) {
        try {
            String key = ROOM_KEY_PREFIX + roomId;
            String roomJson = (String)redisTemplate.opsForValue().get(key);

            if (roomJson == null) {
                throw new RuntimeException("존재하지 않는 방이에요.");
            }

            Room room = objectMapper.readValue(roomJson, Room.class);
            if (!room.getPlayerIds().contains(userId)) {
                throw new RuntimeException("이 방에 입장해 있지 않아요.");
            }

            // 유저 제거
            room.getPlayerIds().remove(userId);
            room.getReadyStatus().remove(userId);
            room.getPlayerCharacters().remove(userId);

            redisTemplate.delete(USER_ROOM_KEY_PREFIX + userId);

            // 방에 유저가 없으면 방 삭제
            if (room.getPlayerIds().isEmpty()) {
                redisTemplate.delete(key);
                return;
            }

            // 나간 사람이 방장이면 다음 사람에게 방장 위임
            if (room.getHostId().equals(userId)) {
                String newHostId = room.getPlayerIds().get(0);
                room.transferHost(newHostId);
            }

            // 방 정보 업데이트
            redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(room));

        } catch (Exception e) {
            throw new RuntimeException("방 나가기에 실패했어요. :" + e.getMessage(), e);
        }
    }

    // 현재 유저의 입장 방 조회
    public Room getMyRoom(String userId) {
        try {
            String roomId = getCurrentRoomId(userId);

            if (roomId == null) {
                return null;
            }

            String key = ROOM_KEY_PREFIX + roomId;
            String roomJson = (String)redisTemplate.opsForValue().get(key);

            if (roomJson == null) {
                // 방은 삭제되었는데 유저 매핑에 남아있는 경우
                redisTemplate.delete(USER_ROOM_KEY_PREFIX + userId);
                return null;
            }

            Room room = objectMapper.readValue(roomJson, Room.class);

            // 방 정보에도 정말 유저가 있는지 확인
            if (!room.getPlayerIds().contains(userId)) {
                redisTemplate.delete(USER_ROOM_KEY_PREFIX + userId);
                return null;
            }

            return room;
        } catch (Exception e) {
            throw new RuntimeException("현재 방 조회에 실패했어요. :" + e.getMessage(), e);
        }
    }
}
