import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import CharacterDisplay from "../components/CharacterDisplay";

interface UserSummaryInfo {
    nickname: string;
    totalGames: number;
    winCount: number;
    winRate: number;
    characterType: string;
}

interface Room {
    roomId: string;
    roomName: string;
    hostId: string;
    hostNickname: string;
    playerIds: string[];
    playerNicknames: { [key: string]: string };
    maxPlayers: number;
    privateRoom: boolean;
    status: "WAITING" | "PLAYING";
    createdAt: string;
    readyStatus: { [key: string]: boolean };
    playerCharacters: { [key: string]: string };
}

function RoomPage() {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const { data: user, isLoading: userLoading } = useQuery<UserSummaryInfo>({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            const res = await api.get("/users/me");
            return res.data;
        },
        retry: 1,
    });

    // 현재 방 정보 조회
    const { data: currentRoom, isLoading: roomLoading } = useQuery<Room>({
        queryKey: ['my-room'],
        queryFn: async () => {
            const res = await api.get("/api/rooms/my-room");
            return res.data;
        },
        retry: 1,
    });

    // 방 진입 시 검증: URL의 roomId와 현재 유저가 입장한 방이 일치하는지 확인
    useEffect(() => {
        if (roomLoading || userLoading) return;

        if (!currentRoom) {
            // 방에 입장하지 않은 상태 → 로비로 리다이렉트
            alert("방에 입장하지 않았거나 방이 존재하지 않아요.");
            navigate("/lobby");
        } else if (currentRoom.roomId !== roomId) {
            // URL의 roomId와 실제 입장한 방이 다름 → 올바른 방으로 리다이렉트
            navigate(`/room/${currentRoom.roomId}`);
        }
    }, [currentRoom, roomId, roomLoading, userLoading, navigate]);

    // 방 나가기 mutation
    const leaveRoomMutation = useMutation({
        mutationFn: async () => {
            if (!roomId) throw new Error("방 ID가 없습니다.");
            return await api.post(`/api/rooms/${roomId}/leave`);
        },
        onSuccess: () => {
            navigate("/lobby");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "방 나가기에 실패했어요.");
            // 에러가 나도 로비로 이동 (방이 이미 삭제되었을 수 있음)
            navigate("/lobby");
        },
    });

    const handleLeaveRoom = () => {
        leaveRoomMutation.mutate();
    };

    // 선택된 플레이어 상세 정보 조회
    const { data: playerDetail } = useQuery<UserSummaryInfo>({
        queryKey: ['user', selectedPlayerId],
        queryFn: async () => {
            if (!selectedPlayerId) throw new Error("선택된 플레이어가 없습니다.");
            const res = await api.get(`/users/${selectedPlayerId}`);
            return res.data;
        },
        enabled: !!selectedPlayerId,
        retry: 1,
    });

    if (userLoading || roomLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <div className="text-lg" style={{ color: 'var(--text-sub)' }}>로딩 중...</div>
            </div>
        );
    }

    if (!currentRoom) {
        return null; // useEffect에서 리다이렉트 처리
    }

    return (
        <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                </div>

                <div className="rounded-lg shadow-xl p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-title)' }}>
                                    {currentRoom.roomName}
                                </h2>
                                {currentRoom.privateRoom && <span className="text-xl">🔒</span>}
                            </div>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
                                방장: {currentRoom.hostNickname} | {currentRoom.playerIds.length}/{currentRoom.maxPlayers}명
                            </p>
                        </div>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-opacity"
                            style={{ backgroundColor: 'var(--error)' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            disabled={leaveRoomMutation.isPending}
                        >
                            {leaveRoomMutation.isPending ? '나가는 중...' : '나가기'}
                        </button>
                    </div>

                    {/* 플레이어 목록 */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-title)' }}>참가자</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {currentRoom.playerIds.map((playerId) => (
                                <div
                                    key={playerId}
                                    className="rounded-lg p-3 flex items-center justify-between cursor-pointer transition-opacity"
                                    style={{ backgroundColor: 'var(--background)' }}
                                    onClick={() => setSelectedPlayerId(playerId)}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    <div className="flex items-center gap-2">
                                        <span style={{ color: 'var(--text-title)' }}>
                                            {playerId === currentRoom.hostId && '👑 '}
                                            {currentRoom.playerNicknames?.[playerId] || playerId}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                                            ({currentRoom.playerCharacters?.[playerId] || '?'})
                                        </span>
                                    </div>
                                    <span className="text-sm">
                                        {currentRoom.readyStatus[playerId] ? '✅' : '⏳'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center py-10">
                        <p className="text-lg" style={{ color: 'var(--text-sub)' }}>
                            Ready 버튼과 채팅 기능은 웹소켓 구현 후 추가될 예정이에요!
                        </p>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-placeholder)' }}>
                            (현재는 새로고침 시에만 방 정보가 업데이트됩니다)
                        </p>
                    </div>
                </div>

                {/* 플레이어 상세 정보 모달 */}
                {selectedPlayerId && playerDetail && (
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setSelectedPlayerId(null)}
                    >
                        <div
                            className="rounded-lg shadow-xl p-6 w-full max-w-sm"
                            style={{ backgroundColor: 'var(--card-bg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center">
                                <div className="scale-75 mb-2">
                                    <CharacterDisplay characterType={playerDetail.characterType} />
                                </div>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
                                    {playerDetail.nickname}
                                </h2>

                                <div className="w-full space-y-3">
                                    <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                                        <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>총 게임 수</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--text-title)' }}>
                                            {playerDetail.totalGames}
                                        </p>
                                    </div>

                                    <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                                        <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>승수</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                                            {playerDetail.winCount}
                                        </p>
                                    </div>

                                    <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                                        <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>승률</p>
                                        <p className="text-xl font-bold" style={{ color: 'var(--point-yellow)' }}>
                                            {playerDetail.winRate}%
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedPlayerId(null)}
                                    className="mt-4 w-full py-2 rounded-lg font-semibold text-white transition-opacity"
                                    style={{ backgroundColor: 'var(--primary)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoomPage;
