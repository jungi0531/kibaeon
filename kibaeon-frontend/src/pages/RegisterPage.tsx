import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./RegisterPage.css";
import CharacterDisplay from "../components/characterDisplay";
import { CHARACTER_TYPES } from "../constants/character";

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

        try {
            await api.post("/register", payload);
            alert("회원가입 완료! 로그인 해주세요!");
            navigate("/login");
        } catch (error: any) {
            if (error.response?.data.fieldErrors) {
                setErrors(error.response.data.fieldErrors);
            } else {
                setErrors({ server: "회원가입 중 오류가 발생했어요." });
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-header">
                <h1 className="register-logo">KIBAEON</h1>
            </div>

            <div className="register-card">
                <h2 className="register-title">회원가입</h2>
                
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="register-input-group">
                        <div className="register-email-row">
                            <input 
                                className={`register-input ${errors.email ? 'error' : ''}`}
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
                            <button 
                                type="button" 
                                className="register-check-button"
                                onClick={handleCheckEmail}
                            >
                                ✓
                            </button>
                        </div>
                        {emailCheckMsg && <p className="register-error">{emailCheckMsg}</p>}
                    </div>

                    <div className="register-input-group">
                        <input 
                            className={`register-input ${errors.password ? 'error' : ''}`}
                            type="password"
                            name="password"
                            placeholder="비밀번호 (8~20자)"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="register-error">{errors.password}</p>}
                    </div>

                    <div className="register-input-group">
                        <input 
                            className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                            type="password"
                            name="confirmPassword"
                            placeholder="비밀번호 확인"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <p className="register-error">{errors.confirmPassword}</p>}
                    </div>

                    <div className="register-input-group">
                        <input 
                            className={`register-input ${errors.nickname ? 'error' : ''}`}
                            type="text"
                            name="nickname"
                            placeholder="닉네임 (2~10자)"
                            value={form.nickname}
                            onChange={handleChange}
                            required
                        />
                        {errors.nickname && <p className="register-error">{errors.nickname}</p>}
                    </div>

                    <div className="register-character-section">
                        <label className="register-field-label">캐릭터 선택</label>
                        <select
                            className="register-select"
                            name="characterType"
                            value={form.characterType}
                            onChange={handleChange}
                        >
                            {CHARACTER_TYPES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>

                        <CharacterDisplay characterType={form.characterType} />
                    </div>

                    {errors.server && (
                        <div className="register-server-error">
                            <p className="register-error">{errors.server}</p>
                        </div>
                    )}

                    <button className="register-button" type="submit">회원가입</button>
                </form>

                <div className="register-footer">
                    <Link className="register-link" to="/login">이미 계정이 있으신가요? 로그인</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;