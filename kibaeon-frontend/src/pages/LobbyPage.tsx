import { useNavigate } from "react-router-dom";

function LobbyPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div>
            <h1>로비</h1>
            <p>방 목록</p>

            <button onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
}

export default LobbyPage;