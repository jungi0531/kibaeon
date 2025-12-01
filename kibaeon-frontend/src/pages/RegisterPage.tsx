import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [characterType, setCharacterType] = useState("KEYCAP_01");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        try {
            await api.post("/register", {
                email,
                password,
                nickname,
                characterType,
            });
            alert("회원가입 완료! 로그인 해주세요!");
            setErrorMessage("");
            navigate("/login");
        } catch (error: any) {
            setErrorMessage("회원가입 중 오류가 발생했어요.");
        }
    }
    return (
        <form onSubmit={handleRegister}>
            <h1>회원가입</h1>

            <input 
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input 
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />

            <label>캐릭터 선택</label>
            <select
                value={characterType}
                onChange={(e) => setCharacterType(e.target.value)}
            >
                <option value="KEYCAP_01">키캡 기본</option>
            </select>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <button type="submit">회원가입</button>
        </form>
    );
}

export default RegisterPage;