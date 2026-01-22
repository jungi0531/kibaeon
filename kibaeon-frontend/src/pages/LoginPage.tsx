import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import axios from "axios";
import KeycapButton from "../components/KeycapButton";
import SettingsButton from "../components/SettingsButton";

interface LoginRequest {
    email: string;
    password: string;
}

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await api.post("/login", data);
            return response.data;
        },
        onSuccess: (token) => {
            localStorage.setItem("token", token);
            setErrorMessage("");
            navigate("/lobby");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401 || status === 400) {
                    setErrorMessage("이메일 또는 비밀번호가 올바르지 않아요.");
                } else {
                    setErrorMessage("로그인 중에 문제가 발생했어요.");
                }
            }
        },
    });

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
            <SettingsButton />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold logo-text" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                </div>

                <div className="rounded-lg shadow-xl p-8 keycap-card" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-title)' }}>로그인</h2>

                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                        <input
                            className="w-full px-4 py-3 rounded-lg keycap-input transition-colors outline-none"
                            style={{
                                borderColor: '#4A3F35',
                                color: 'var(--text-body)',
                                backgroundColor: '#FFFCF7'
                            }}
                            type="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="w-full px-4 py-3 rounded-lg keycap-input transition-colors outline-none"
                            style={{
                                borderColor: '#4A3F35',
                                color: 'var(--text-body)',
                                backgroundColor: '#FFFCF7'
                            }}
                            type="password"
                            placeholder="비밀번호 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {errorMessage && (
                            <p className="text-sm text-center p-2 rounded" style={{ color: 'var(--error)', backgroundColor: 'var(--background)' }}>
                                {errorMessage}
                            </p>
                        )}

                        <KeycapButton
                            className="w-full"
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={loginMutation.isPending}
                            worn={true}
                        >
                            {loginMutation.isPending ? '로그인 중...' : '로그인'}
                        </KeycapButton>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            className="text-sm transition-colors"
                            style={{ color: 'var(--secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                            to="/register"
                        >
                            회원가입 하러가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;