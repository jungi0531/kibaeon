import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    playerIds: string[];
    maxPlayers: number;
    isPrivate: boolean;
    status: "WAITING" | "PLAYING";
    createdAt: string;
}

function LobbyPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomForm, setRoomForm] = useState({
        roomName: "",
        maxPlayers: 2,
        isPrivate: false,
        password: "",
    });

    // TanStack Query로 유저 정보 가져오기
    const { data: user, isLoading, error } = useQuery<UserSummaryInfo>({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            const res = await api.get("/users/me");
            return res.data;
        },
        retry: 1,
    });

    // 방 목록 가져오기
    const { data: rooms = [], isLoading: roomsLoading, refetch: refetchRooms } = useQuery<Room[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await api.get("/api/rooms");
            return res.data;
        },
    });

    // 방 생성 mutation
    const createRoomMutation = useMutation({
        mutationFn: async (data: typeof roomForm) => {
            return await api.post("/api/rooms", data);
        },
        onSuccess: (response) => {
            const room = response.data;
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setShowCreateModal(false);
            setRoomForm({
                roomName: "",
                maxPlayers: 2,
                isPrivate: false,
                password: "",
            });
            // 방 생성 후 바로 해당 방으로 이동
            navigate(`/room/${room.roomId}`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "방 생성에 실패했어요.");
        },
    });

    // 방 삭제 mutation
    const deleteRoomMutation = useMutation({
        mutationFn: async (roomId: string) => {
            return await api.delete(`/api/rooms/${roomId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "방 삭제에 실패했어요.");
        },
    });

    // 에러 처리
    if (error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
            alert("로그인 정보가 만료되었거나 유효하지 않아요. 다시 로그인해주세요.");
            navigate("/login");
        } else if (axiosError.message === "Network Error" || !axiosError.response) {
            alert("네트워크 오류로 유저 정보를 가져올 수 없어요. 인터넷 연결을 확인하고 다시 시도해주세요.");
        } else {
            alert("서버 오류로 유저 정보를 가져올 수 없어요. 잠시 후 다시 시도해주세요.");
        }
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB]">
                <div className="text-lg text-[#6F6F6F]">로딩 중이에요...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="flex gap-4 h-[calc(100vh-2rem)]">
                {/* 왼쪽 사이드바 - 유저 정보 */}
                <div className="w-64 rounded-lg shadow-lg p-4 flex flex-col h-[70vh]" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
                    {/* 유저 프로필 */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="scale-75">
                            <CharacterDisplay characterType={user.characterType} />
                        </div>
                        <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--text-title)' }}>
                            {user.nickname}
                        </h2>
                    </div>

                    {/* 유저 통계 */}
                    <div className="space-y-3 flex-1">
                        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>총 게임 수</p>
                            <p className="text-xl font-bold" style={{ color: 'var(--text-title)' }}>
                                {user.totalGames}
                            </p>
                        </div>

                        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>승수</p>
                            <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                                {user.winCount}
                            </p>
                        </div>

                        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>승률</p>
                            <p className="text-xl font-bold" style={{ color: 'var(--point-yellow)' }}>
                                {user.winRate}%
                            </p>
                        </div>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-4 px-4 py-2 text-white rounded-lg transition-colors font-semibold text-sm"
                        style={{ backgroundColor: 'var(--point-orange)' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        로그아웃
                    </button>
                </div>

                {/* 오른쪽 메인 영역 */}
                <div className="flex-1 overflow-auto">
                    {/* 로고 및 버튼 */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => refetchRooms()}
                                className="px-4 py-2 rounded-lg font-semibold transition-opacity"
                                style={{ backgroundColor: 'var(--secondary)', color: 'white' }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                disabled={roomsLoading}
                            >
                                🔄 새로고침
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-2 rounded-lg font-semibold text-white transition-opacity"
                                style={{ backgroundColor: 'var(--primary)' }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                방 만들기
                            </button>
                        </div>
                    </div>

                    {roomsLoading ? (
                        <div className="text-center py-8" style={{ color: 'var(--text-sub)' }}>
                            로딩 중...
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <p style={{ color: 'var(--text-sub)' }}>아직 생성된 방이 없어요. 첫 번째 방을 만들어보세요!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {[...rooms].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((room) => (
                                <div
                                    key={room.roomId}
                                    className="rounded-lg shadow-md flex overflow-hidden"
                                    style={{ backgroundColor: 'var(--card-bg)', height: '120px' }}
                                >
                                    <div className="flex-1 p-4 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold flex-1 truncate" style={{ color: 'var(--text-title)' }}>
                                                {room.roomName}
                                            </h3>
                                            {room.isPrivate && (
                                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--point-orange)', color: 'white' }}>
                                                    🔒
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-3 mb-2 text-sm" style={{ color: 'var(--text-sub)' }}>
                                            <span>👥 {room.playerIds.length}/{room.maxPlayers}</span>
                                            <span>{room.status === 'WAITING' ? '⏳ 대기중' : '🎮 게임중'}</span>
                                        </div>

                                        {room.hostId === user?.nickname && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('정말 방을 삭제하시겠어요?')) {
                                                        deleteRoomMutation.mutate(room.roomId);
                                                    }
                                                }}
                                                className="mt-auto py-1 rounded-lg font-semibold text-white transition-opacity text-sm"
                                                style={{ backgroundColor: 'var(--error)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/room/${room.roomId}`)}
                                        className="w-24 flex items-center justify-center font-bold text-white transition-opacity"
                                        style={{ backgroundColor: 'var(--primary)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        disabled={room.status === 'PLAYING'}
                                    >
                                        입장
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 방 만들기 모달 */}
                {showCreateModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <div
                            className="rounded-lg shadow-xl p-6 w-full max-w-md"
                            style={{ backgroundColor: 'var(--card-bg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>방 만들기</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
                                        방 이름
                                    </label>
                                    <input
                                        className="w-full px-4 py-2 rounded-lg border-2 transition-colors outline-none"
                                        style={{
                                            borderColor: 'var(--text-placeholder)',
                                            color: 'var(--text-body)'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--text-placeholder)'}
                                        type="text"
                                        placeholder="방 이름을 입력하세요"
                                        value={roomForm.roomName}
                                        onChange={(e) => setRoomForm({ ...roomForm, roomName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
                                        최대 인원
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border-2 transition-colors outline-none"
                                        style={{
                                            borderColor: 'var(--text-placeholder)',
                                            color: 'var(--text-body)'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--text-placeholder)'}
                                        value={roomForm.maxPlayers}
                                        onChange={(e) => setRoomForm({ ...roomForm, maxPlayers: Number(e.target.value) })}
                                    >
                                        <option value={2}>2명</option>
                                        <option value={3}>3명</option>
                                        <option value={4}>4명</option>
                                        <option value={6}>6명</option>
                                        <option value={8}>8명</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roomForm.isPrivate}
                                            onChange={(e) => setRoomForm({ ...roomForm, isPrivate: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-semibold" style={{ color: 'var(--text-title)' }}>
                                            비공개 방
                                        </span>
                                    </label>
                                </div>

                                {roomForm.isPrivate && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
                                            비밀번호
                                        </label>
                                        <input
                                            className="w-full px-4 py-2 rounded-lg border-2 transition-colors outline-none"
                                            style={{
                                                borderColor: 'var(--text-placeholder)',
                                                color: 'var(--text-body)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--text-placeholder)'}
                                            type="password"
                                            placeholder="비밀번호를 입력하세요"
                                            value={roomForm.password}
                                            onChange={(e) => setRoomForm({ ...roomForm, password: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-2 rounded-lg font-semibold transition-opacity"
                                        style={{ backgroundColor: 'var(--text-sub)', color: 'white' }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!roomForm.roomName.trim()) {
                                                alert('방 이름을 입력해주세요.');
                                                return;
                                            }
                                            if (roomForm.isPrivate && !roomForm.password.trim()) {
                                                alert('비밀번호를 입력해주세요.');
                                                return;
                                            }
                                            createRoomMutation.mutate(roomForm);
                                        }}
                                        className="flex-1 py-2 rounded-lg font-semibold text-white transition-opacity"
                                        style={{ backgroundColor: 'var(--primary)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                        disabled={createRoomMutation.isPending}
                                    >
                                        {createRoomMutation.isPending ? '생성 중...' : '만들기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LobbyPage;
