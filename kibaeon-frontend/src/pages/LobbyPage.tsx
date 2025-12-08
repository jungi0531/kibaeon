import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CharacterDisplay from "../components/CharacterDisplay";

interface UserSummaryInfo {
    nickname: string,
    totalGames: number,
    winCount: number,
    winRate: number,
    characterType: string;
}

function LobbyPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserSummaryInfo | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/users/me");
                setUser(res.data);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    alert("로그인 정보가 만료되었거나 유효하지 않아요. 다시 로그인해주세요.");
                    navigate("/login");
                } else if (error.message === "Network Error" || !error.response) {
                    alert("네트워크 오류로 유저 정보를 가져올 수 없어요. 인터넷 연결을 확인하고 다시 시도해주세요.");
                } else {
                    alert("서버 오류로 유저 정보를 가져올 수 없어요. 잠시 후 다시 시도해주세요.");
                }
            }
        }
        fetchUser();
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (!user) return <div>로딩 중이에요...</div>;

    return (
        <div>
            <h1>로비</h1>

            <CharacterDisplay characterType={user.characterType} />
            <p>닉네임: {user.nickname}</p>
            <p>총 게임 수: {user.totalGames}</p>
            <p>승수: {user.winCount}</p>
            <p>승률: {user.winRate}</p>

            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}

export default LobbyPage;