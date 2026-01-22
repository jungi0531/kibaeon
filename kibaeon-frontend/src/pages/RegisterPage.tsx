import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import CharacterCarousel from "../components/CharacterCarousel";
import KeycapButton from "../components/KeycapButton";
import SettingsButton from "../components/SettingsButton";

interface RegisterRequest {
    email: string;
    password: string;
    nickname: string;
    characterType: string;
}

function RegisterPage() {
    const navigate = useNavigate();

    const [emailCheckMsg, setEmailCheckMsg] = useState<string | null>(null);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        characterType: "KEYCAP_01",
    });

    const [errors, setErrors] = useState({} as Record<string, string>);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterRequest) => {
            return await api.post("/register", data);
        },
        onSuccess: () => {
            alert("회원가입 완료! 로그인 해주세요!");
            navigate("/login");
        },
        onError: (error: any) => {
            if (error.response?.data.fieldErrors) {
                setErrors(error.response.data.fieldErrors);
            } else {
                setErrors({ server: "회원가입 중 오류가 발생했어요." });
            }
        },
    });

    async function handleCheckEmail() {
        if (!form.email) {
            setEmailCheckMsg("이메일을 입력해주세요.");
            return;
        }

        if (!validateEmail(form.email)) {
            setEmailCheckMsg("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        try {
            const res = await api.get("/check-email", {
                params: { email: form.email },
            });

            if (res.data === true) {
                setEmailCheckMsg("이미 사용 중인 이메일이에요.");
                setIsEmailChecked(false);
            } else {
                setEmailCheckMsg("사용 가능한 이메일이에요!");
                setIsEmailChecked(true);
            }
        } catch (error) {
            setEmailCheckMsg("중복 확인 중 오류가 발생했어요.");
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!validateEmail(form.email)) {
            newErrors.email = "올바른 이메일 형식을 입력해주세요.";
        }
        if (!isEmailChecked) {
            newErrors.email = "이메일 중복 확인을 먼저 해주세요.";
        }
        if (form.password.length < 8 || form.password.length > 20) {
            newErrors.password = "비밀번호는 8 ~ 20자 사이여야 해요.";
        }
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "비밀번호가 일치하지 않아요.";
        }
        if (form.nickname.length < 2 || form.nickname.length > 10) {
            newErrors.nickname = "닉네임은 2 ~ 10자 사이여야 해요.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            email: form.email,
            password: form.password,
            nickname: form.nickname,
            characterType: form.characterType,
        };

        registerMutation.mutate(payload);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
            <SettingsButton />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold logo-text" style={{ color: 'var(--primary)' }}>KIBAEON</h1>
                </div>

                <div className="rounded-lg shadow-xl p-8 keycap-card" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-title)' }}>회원가입</h2>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 px-4 py-3 rounded-lg keycap-input outline-none"
                                    style={{
                                        borderColor: errors.email ? 'var(--error)' : undefined,
                                        color: 'var(--text-body)'
                                    }}
                                    type="email"
                                    name="email"
                                    placeholder="이메일"
                                    value={form.email}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setEmailCheckMsg(null);
                                        setIsEmailChecked(false);
                                    }}
                                    required
                                />
                                <KeycapButton
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={handleCheckEmail}
                                >
                                    ✓
                                </KeycapButton>
                            </div>
                            {emailCheckMsg && (
                                <p className="text-sm mt-1" style={{ color: isEmailChecked ? 'var(--primary)' : 'var(--error)' }}>
                                    {emailCheckMsg}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                className="w-full px-4 py-3 rounded-lg keycap-input outline-none"
                                style={{
                                    borderColor: errors.password ? 'var(--error)' : undefined,
                                    color: 'var(--text-body)'
                                }}
                                type="password"
                                name="password"
                                placeholder="비밀번호 (8~20자)"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.password}</p>}
                        </div>

                        <div>
                            <input
                                className="w-full px-4 py-3 rounded-lg keycap-input outline-none"
                                style={{
                                    borderColor: errors.confirmPassword ? 'var(--error)' : undefined,
                                    color: 'var(--text-body)'
                                }}
                                type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.confirmPassword}</p>}
                        </div>

                        <div>
                            <input
                                className="w-full px-4 py-3 rounded-lg keycap-input outline-none"
                                style={{
                                    borderColor: errors.nickname ? 'var(--error)' : undefined,
                                    color: 'var(--text-body)'
                                }}
                                type="text"
                                name="nickname"
                                placeholder="닉네임 (2~10자)"
                                value={form.nickname}
                                onChange={handleChange}
                                required
                            />
                            {errors.nickname && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.nickname}</p>}
                        </div>

                        <CharacterCarousel
                            selectedCharacter={form.characterType}
                            onCharacterChange={(characterType) => setForm({ ...form, characterType })}
                        />

                        {errors.server && (
                            <p className="text-sm text-center p-2 rounded" style={{ color: 'var(--error)', backgroundColor: 'var(--background)' }}>
                                {errors.server}
                            </p>
                        )}

                        <KeycapButton
                            className="w-full"
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={registerMutation.isPending}
                            worn={true}
                        >
                            {registerMutation.isPending ? '회원가입 중...' : '회원가입'}
                        </KeycapButton>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            className="text-sm transition-colors"
                            style={{ color: 'var(--secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                            to="/login"
                        >
                            이미 계정이 있으신가요? 로그인
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
