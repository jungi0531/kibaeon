import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface UserSummaryInfo {
    nickname: string;
    totalGames: number;
    winCount: number;
    winRate: number;
    characterType: string;
}

function RoomPage() {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();

    const { data: user, isLoading } = useQuery<UserSummaryInfo>({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            const res = await api.get("/users/me");
            return res.data;
        },
        retry: 1,
    });

    const handleLeaveRoom = () => {
        // TODO: 방 나가기 API 호출
        navigate("/lobby");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <div className="text-lg" style={{ color: 'var(--text-sub)' }}>로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                </div>

                <div className="rounded-lg shadow-xl p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-title)' }}>방 #{roomId}</h2>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-opacity"
                            style={{ backgroundColor: 'var(--error)' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            나가기
                        </button>
                    </div>

                    <div className="text-center py-20">
                        <p className="text-lg" style={{ color: 'var(--text-sub)' }}>
                            방 대기실 UI는 곧 구현될 예정이에요!
                        </p>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-placeholder)' }}>
                            {user?.nickname}님이 입장하셨습니다
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomPage;
