package com.kibaeon.backend.room;

import com.kibaeon.backend.room.dto.CreateRoomRequest;
import com.kibaeon.backend.room.dto.JoinRoomRequest;
import com.kibaeon.backend.room.dto.RoomListResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    // 방 생성
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request, Authentication authentication) {
        String hostId = authentication.getName();

        Room room = roomService.createRoom(
                request.getRoomName(),
                hostId,
                request.getMaxPlayers(),
                request.isPrivateRoom(),
                request.getPassword()
        );

        return ResponseEntity.ok(room);
    }

    // 방 목록 조회 (비밀번호 제외)
    @GetMapping
    public ResponseEntity<List<RoomListResponse>> getAllRooms() {
        List<RoomListResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // 방 삭제
    // 이 기능은 방장이 방 폭파를 위한 기능 프론트에 구현은 하지 않았지만 우선 남겨둠.
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String roomId, Authentication authentication) {
        String userId = authentication.getName();
        roomService.deleteRoom(roomId, userId);

        return ResponseEntity.noContent().build();
    }

    // 방 입장
    @PostMapping("/{roomId}/join")
    public ResponseEntity<Room> joinRoom(@PathVariable String roomId, @RequestBody(required = false)JoinRoomRequest request, Authentication authentication) {
        String userId = authentication.getName();
        String password = request != null ? request.getPassword() : null;
        Room room = roomService.joinRoom(roomId, userId, password);

        return ResponseEntity.ok(room);
    }

    // 방 나가기
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(@PathVariable String roomId, Authentication authentication) {
        String userId = authentication.getName();
        roomService.leaveRoom(roomId, userId);

        return ResponseEntity.noContent().build();
    }

    // 현재 유저의 입장 방 조회
    @GetMapping("/my-room")
    public ResponseEntity<Room> getMyRoom(Authentication authentication) {
        String userId = authentication.getName();
        Room room = roomService.getMyRoom(userId);

        if (room == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(room);
    }
}
