package com.kibaeon.backend.room;

import com.kibaeon.backend.room.dto.CreateRoomRequest;
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
                request.isPrivate(),
                request.getPassword()
        );

        return ResponseEntity.ok(room);
    }

    // 방 목록 조회
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // 방 삭제
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String roomId, Authentication authentication) {
        String userId = authentication.getName();
        roomService.deleteRoom(roomId, userId);

        return ResponseEntity.noContent().build();
    }
}
