import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";
import "./LoginPage.css";

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
            localStorage.setItem("token", response.data);
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
        <div className="login-container">
            <div className="login-header">
                <h1 className="login-logo">KIBAEON</h1>
            </div>

            <div className="login-card">
                <h2 className="login-title">로그인</h2>
                
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <input 
                        className="login-input"
                        type="email"
                        placeholder="이메일 입력"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <input 
                        className="login-input"
                        type="password"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    {errorMessage && (
                        <p className="login-error">
                            {errorMessage}
                        </p>
                    )}

                    <button className="login-button" type="submit">로그인</button>
                </form>

                <div className="login-footer">
                    <Link className="login-link" to="/register">회원가입 하러가기</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage