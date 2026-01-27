import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import CharacterDisplay from "../components/CharacterDisplay";
import KeycapButton from "../components/KeycapButton";
import SettingsButton from "../components/SettingsButton";
import LoadingKeycaps from "../components/LoadingKeycaps";

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
    maxPlayers: number;
    privateRoom: boolean;
    status: "WAITING" | "PLAYING";
    createdAt: string;
}

function LobbyPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [roomForm, setRoomForm] = useState({
        roomName: "",
        maxPlayers: 2,
        privateRoom: false,
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

    // 현재 유저가 입장한 방 확인 및 로비 진입 시 방 목록 새로고침
    useEffect(() => {
        const checkCurrentRoom = async () => {
            try {
                const res = await api.get("/api/rooms/my-room");
                if (res.data && res.data.roomId) {
                    // 이미 방에 있으면 해당 방으로 리다이렉트
                    navigate(`/room/${res.data.roomId}`);
                } else {
                    // 방에 없으면 방 목록 새로고침
                    refetchRooms();
                }
            } catch (error: any) {
                // 404 에러는 정상 (방에 없음) - 방 목록 새로고침
                if (error.response?.status === 404) {
                    refetchRooms();
                } else {
                    console.error("현재 방 확인 실패:", error);
                }
            }
        };

        if (user) {
            checkCurrentRoom();
        }
    }, [user, navigate, refetchRooms]);

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
                privateRoom: false,
                password: "",
            });
            // 방 생성 후 바로 해당 방으로 이동
            navigate(`/room/${room.roomId}`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "방 생성에 실패했어요.");
        },
    });

    // 방 입장 mutation
    const joinRoomMutation = useMutation({
        mutationFn: async ({ roomId, password }: { roomId: string; password?: string }) => {
            return await api.post(`/api/rooms/${roomId}/join`, password ? { password } : {});
        },
        onSuccess: (_, variables) => {
            navigate(`/room/${variables.roomId}`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "방 입장에 실패했어요.");
        },
    });

    // 방 입장 핸들러
    const handleJoinRoom = (room: Room) => {
        if (room.privateRoom) {
            setSelectedRoom(room);
            setShowPasswordModal(true);
        } else {
            joinRoomMutation.mutate({ roomId: room.roomId });
        }
    };

    // 비밀번호로 방 입장
    const handleJoinWithPassword = () => {
        if (!selectedRoom) return;
        if (!passwordInput.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        joinRoomMutation.mutate({ roomId: selectedRoom.roomId, password: passwordInput });
        setShowPasswordModal(false);
        setPasswordInput("");
        setSelectedRoom(null);
    };

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
            <SettingsButton />
            <div className="flex gap-4 h-[calc(100vh-2rem)]">
                {/* 왼쪽 사이드바 - 유저 정보 */}
                <div className="w-64 rounded-lg shadow-lg p-4 flex flex-col h-full keycap-card" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
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
                            <p className="text-xl font-bold" style={{ color: 'var(--text-title)' }}>
                                {user.winCount}
                            </p>
                        </div>

                        <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-sub)' }}>승률</p>
                            <p className="text-xl font-bold" style={{ color: 'var(--text-title)' }}>
                                {user.winRate}%
                            </p>
                        </div>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <KeycapButton
                        onClick={handleLogout}
                        className="w-full mt-4"
                        variant="danger"
                        size="sm"
                    >
                        로그아웃
                    </KeycapButton>
                </div>

                {/* 오른쪽 메인 영역 */}
                <div className="flex-1 overflow-auto">
                    {/* 로고 및 버튼 */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold logo-text mb-4" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                        <div className="flex justify-center gap-2">
                            <KeycapButton
                                onClick={() => refetchRooms()}
                                variant="secondary"
                                size="md"
                                disabled={roomsLoading}
                            >
                                🔄 새로고침
                            </KeycapButton>
                            <KeycapButton
                                onClick={() => setShowCreateModal(true)}
                                variant="primary"
                                size="md"
                            >
                                방 만들기
                            </KeycapButton>
                            <KeycapButton
                                onClick={() => navigate("/practice")}
                                variant="warning"
                                size="md"
                            >
                                연습 모드
                            </KeycapButton>
                        </div>
                    </div>

                    {roomsLoading ? (
                        <LoadingKeycaps text="방 목록 불러오는 중" />
                    ) : rooms.length === 0 ? (
                        <div className="rounded-lg shadow-md p-6 text-center keycap-card" style={{ backgroundColor: 'var(--card-bg)' }}>
                            <p className="font-bold" style={{ color: 'var(--text-sub)' }}>아직 생성된 방이 없어요</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {[...rooms].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((room) => (
                                <div
                                    key={room.roomId}
                                    className="rounded-lg shadow-md flex overflow-hidden keycap-card"
                                    style={{ backgroundColor: 'var(--card-bg)', height: '120px' }}
                                >
                                    <div className="flex-1 p-4 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold flex-1 truncate" style={{ color: 'var(--text-title)' }}>
                                                {room.roomName}
                                            </h3>
                                            {room.privateRoom && <span className="text-lg">🔒</span>}
                                        </div>

                                        <div className="flex flex-col gap-1 mb-2 text-sm" style={{ color: 'var(--text-sub)' }}>
                                            <div className="flex gap-3">
                                                <span>👥 {room.playerIds.length}/{room.maxPlayers}</span>
                                                <span>{room.status === 'WAITING' ? '⏳ 대기중' : '🎮 게임중'}</span>
                                            </div>
                                            <span className="text-xs">👑 {room.hostNickname}</span>
                                        </div>

                                        {/* 방 삭제 버튼 제거 - 방장이 나가면 자동으로 방이 삭제됨 */}
                                    </div>

                                    <KeycapButton
                                        onClick={() => handleJoinRoom(room)}
                                        className="w-24 flex items-center justify-center"
                                        variant="primary"
                                        size="md"
                                        disabled={room.status === 'PLAYING' || joinRoomMutation.isPending}
                                        worn={true}
                                    >
                                        {joinRoomMutation.isPending ? '입장 중...' : '입장'}
                                    </KeycapButton>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 비밀번호 입력 모달 */}
                {showPasswordModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => {
                            setShowPasswordModal(false);
                            setPasswordInput("");
                            setSelectedRoom(null);
                        }}
                    >
                        <div
                            className="rounded-lg shadow-xl p-6 w-full max-w-sm keycap-modal"
                            style={{ backgroundColor: 'var(--card-bg)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
                                🔒 비밀번호 입력
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
                                        방 이름: {selectedRoom?.roomName}
                                    </label>
                                    <input
                                        className="w-full px-4 py-2 rounded-lg keycap-input outline-none"
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleJoinWithPassword();
                                            }
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <KeycapButton
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordInput("");
                                            setSelectedRoom(null);
                                        }}
                                        className="flex-1"
                                        variant="neutral"
                                        size="md"
                                    >
                                        취소
                                    </KeycapButton>
                                    <KeycapButton
                                        onClick={handleJoinWithPassword}
                                        className="flex-1"
                                        variant="primary"
                                        size="md"
                                        disabled={joinRoomMutation.isPending}
                                    >
                                        {joinRoomMutation.isPending ? '입장 중...' : '입장'}
                                    </KeycapButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 방 만들기 모달 */}
                {showCreateModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4 z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <div
                            className="rounded-lg shadow-xl p-6 w-full max-w-md keycap-modal"
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
                                        className="w-full px-4 py-2 rounded-lg keycap-input outline-none"
                                        type="text"
                                        placeholder="방 이름을 입력하세요"
                                        value={roomForm.roomName}
                                        onChange={(e) => setRoomForm({ ...roomForm, roomName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
                                        최대 인원
                                    </label>
                                    <div className="flex gap-2">
                                        {[2, 3, 4, 5, 6].map((num) => (
                                            <KeycapButton
                                                key={num}
                                                type="button"
                                                variant={roomForm.maxPlayers === num ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setRoomForm({ ...roomForm, maxPlayers: num })}
                                                className="flex-1"
                                            >
                                                {num}명
                                            </KeycapButton>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roomForm.privateRoom}
                                            onChange={(e) => setRoomForm({ ...roomForm, privateRoom: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-semibold" style={{ color: 'var(--text-title)' }}>
                                            비공개 방
                                        </span>
                                    </label>
                                </div>

                                {roomForm.privateRoom && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
                                            비밀번호
                                        </label>
                                        <input
                                            className="w-full px-4 py-2 rounded-lg keycap-input outline-none"
                                            type="password"
                                            placeholder="비밀번호를 입력하세요"
                                            value={roomForm.password}
                                            onChange={(e) => setRoomForm({ ...roomForm, password: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <KeycapButton
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1"
                                        variant="neutral"
                                        size="md"
                                    >
                                        취소
                                    </KeycapButton>
                                    <KeycapButton
                                        onClick={() => {
                                            if (!roomForm.roomName.trim()) {
                                                alert('방 이름을 입력해주세요.');
                                                return;
                                            }
                                            if (roomForm.privateRoom && !roomForm.password.trim()) {
                                                alert('비밀번호를 입력해주세요.');
                                                return;
                                            }
                                            createRoomMutation.mutate(roomForm);
                                        }}
                                        className="flex-1"
                                        variant="primary"
                                        size="md"
                                        disabled={createRoomMutation.isPending}
                                    >
                                        {createRoomMutation.isPending ? '생성 중...' : '만들기'}
                                    </KeycapButton>
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
