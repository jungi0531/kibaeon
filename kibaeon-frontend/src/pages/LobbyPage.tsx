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
            } catch (error) {
                console.log(error);
                alert("유저 정보 가져오기를 실패했어요.");
                navigate("/login");
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