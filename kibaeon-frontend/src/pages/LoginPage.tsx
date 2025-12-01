import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await api.post("/login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token);
            setErrorMessage("");
            navigate("/lobby");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401 || status === 400) {
                    setErrorMessage("이메일 또는 비밀번호가 올바르지 않아요.");
                }
                else {
                    setErrorMessage("로그인 중에 문제가 발생했어요.");
                }
            }
        }
    }

    return (
        <form onSubmit={handleLoginSubmit}>
            <h1>로그인</h1>

            <input 
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
                <p style={{ color: "red", fontSize: "14px"}}>
                    {errorMessage}
                </p>
            )}

            <button type="submit">로그인</button>

            <Link to="/register">회원가입</Link>
        </form>
    )
}

export default LoginPage