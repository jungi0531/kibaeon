import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import KeycapButton from "../components/KeycapButton";
import SettingsButton from "../components/SettingsButton";
import LoadingKeycaps from "../components/LoadingKeycaps";
import { playKeyboardSound } from "../utils/sound";

interface Sentence {
    id: number;
    content: string;
    category: string;
}

// 한글 자소 분리 함수 (타수 계산용)
const getJasoCount = (str: string): number => {
    let count = 0;
    for (const char of str) {
        const code = char.charCodeAt(0);
        // 한글 완성형 범위 (가-힣)
        if (code >= 0xAC00 && code <= 0xD7A3) {
            const offset = code - 0xAC00;
            const jong = offset % 28; // 종성
            // 초성 + 중성 = 2타, 종성 있으면 +1타
            count += jong > 0 ? 3 : 2;
        } else {
            // 한글 외 문자 (영어, 숫자, 특수문자 등)는 1타
            count += 1;
        }
    }
    return count;
};

// 한글 조합 중인지 확인 (자음/모음만 있는 경우)
const isComposing = (char: string): boolean => {
    const code = char.charCodeAt(0);
    // 한글 자모 범위 (ㄱ-ㅎ, ㅏ-ㅣ)
    return (code >= 0x3131 && code <= 0x3163);
};

function PracticePage() {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [sentenceKey, setSentenceKey] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevInputRef = useRef("");

    // 타수 및 오타 측정용
    const [startTime, setStartTime] = useState<number | null>(null);
    const [typingSpeed, setTypingSpeed] = useState(0); // 타/분
    const [errorCount, setErrorCount] = useState(0);
    const [checkedIndex, setCheckedIndex] = useState(-1); // 이미 체크한 글자 인덱스

    // 랜덤 문장 가져오기
    const { data: sentence, isLoading, refetch } = useQuery<Sentence>({
        queryKey: ['sentence', 'random', sentenceKey],
        queryFn: async () => {
            const res = await api.get("/api/sentences/random");
            return res.data;
        },
    });

    // 다음 문장으로
    const handleNextSentence = useCallback(() => {
        setInput("");
        setIsCompleted(false);
        setSentenceKey(prev => prev + 1);
        setStartTime(null);
        setTypingSpeed(0);
        setErrorCount(0);
        setCheckedIndex(-1);
        prevInputRef.current = "";
        refetch();
    }, [refetch]);

    // 입력창에 자동 포커스
    useEffect(() => {
        if (inputRef.current && !isLoading && !isCompleted) {
            inputRef.current.focus();
        }
    }, [isLoading, sentenceKey, isCompleted]);

    // 전역 키보드 이벤트 (완료 후 엔터/스페이스로 다음 문장)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (isCompleted && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleNextSentence();
            }
        };

        if (isCompleted) {
            window.addEventListener('keydown', handleGlobalKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [isCompleted, handleNextSentence]);

    // 타수 계산 (실시간, 자소 분리 방식)
    useEffect(() => {
        if (startTime && input.length > 0 && !isCompleted) {
            const elapsedMinutes = (Date.now() - startTime) / 60000;
            if (elapsedMinutes > 0) {
                // 한글 자소 분리 방식 타수 계산
                const jasoCount = getJasoCount(input);
                const speed = Math.round(jasoCount / elapsedMinutes);
                setTypingSpeed(speed);
            }
        }
    }, [input, startTime, isCompleted]);

    // 입력값 변경 처리
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const prevValue = prevInputRef.current;

        // 첫 입력 시 시작 시간 기록
        if (!startTime && value.length === 1) {
            setStartTime(Date.now());
        }

        // 오타 체크: 완성된 글자만 비교
        // 새 글자가 추가되었고, 이전 글자가 확정된 경우에만 체크
        if (sentence && value.length > prevValue.length) {
            // 이전 입력의 마지막 글자가 있고, 그게 조합 중이 아니면 (완성됨)
            // 새 글자로 넘어갔다는 의미 -> 이전 글자를 체크
            if (prevValue.length > 0 && prevValue.length - 1 > checkedIndex) {
                const lastCharIndex = prevValue.length - 1;
                const lastChar = prevValue[lastCharIndex];

                // 조합 중이 아닌 완성된 글자일 때만 체크
                if (!isComposing(lastChar) && lastCharIndex < sentence.content.length) {
                    if (lastChar !== sentence.content[lastCharIndex]) {
                        setErrorCount(prev => prev + 1);
                    }
                    setCheckedIndex(lastCharIndex);
                }
            }
            playKeyboardSound();
        }

        prevInputRef.current = value;
        setInput(value);

        // 문장 완성 체크
        if (sentence && value === sentence.content) {
            // 완성 시 마지막 글자도 체크
            const lastIndex = value.length - 1;
            if (lastIndex > checkedIndex && lastIndex < sentence.content.length) {
                if (value[lastIndex] !== sentence.content[lastIndex]) {
                    setErrorCount(prev => prev + 1);
                }
            }
            setIsCompleted(true);
        }
    };

    // 정확도 계산 (완성된 글자 기준)
    const getAccuracy = () => {
        if (!sentence || sentence.content.length === 0) return 100;

        // 체크된 글자가 없으면 100%
        const totalChecked = checkedIndex + 1 + (isCompleted ? 1 : 0);
        if (totalChecked === 0) return 100;

        const correctCount = totalChecked - errorCount;
        return Math.round((correctCount / totalChecked) * 100);
    };

    // 오버레이 방식 문장 렌더링
    const renderOverlaySentence = () => {
        if (!sentence) return null;

        return (
            <div className="relative">
                {/* 배경: 연한 문장 */}
                <p className="text-2xl font-mono leading-relaxed tracking-wide" style={{ color: 'var(--text-sub)', opacity: 0.4 }}>
                    {sentence.content}
                </p>
                {/* 전경: 입력된 글자 (진하게) */}
                <p className="text-2xl font-mono leading-relaxed tracking-wide absolute top-0 left-0">
                    {input.split("").map((char, index) => {
                        // 조합 중인 글자는 기본 색상, 완성된 글자만 맞춤/틀림 표시
                        const isLastChar = index === input.length - 1;
                        const isCharComposing = isLastChar && isComposing(char);

                        let color = 'var(--text-title)';
                        if (!isCharComposing) {
                            const isCorrect = char === sentence.content[index];
                            color = isCorrect ? 'var(--text-title)' : 'var(--danger)';
                        }

                        return (
                            <span
                                key={index}
                                style={{
                                    color,
                                    fontWeight: 'bold',
                                }}
                            >
                                {char}
                            </span>
                        );
                    })}
                    {/* 커서 표시 */}
                    {!isCompleted && (
                        <span className="animate-pulse" style={{ color: 'var(--primary)' }}>|</span>
                    )}
                </p>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <LoadingKeycaps text="문장 불러오는 중" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <SettingsButton />
            <div className="w-full max-w-3xl">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                        연습 모드
                    </h1>
                    <KeycapButton
                        onClick={() => navigate("/lobby")}
                        variant="neutral"
                        size="sm"
                    >
                        로비로 돌아가기
                    </KeycapButton>
                </div>

                {/* 통계 표시 */}
                <div className="flex justify-center gap-6 mb-6">
                    <div
                        className="rounded-lg px-6 py-3 text-center keycap-card"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>타수</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                            {typingSpeed}
                        </p>
                    </div>
                    <div
                        className="rounded-lg px-6 py-3 text-center keycap-card"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>정확도</p>
                        <p className="text-2xl font-bold" style={{ color: getAccuracy() < 90 ? 'var(--danger)' : 'var(--text-title)' }}>
                            {getAccuracy()}%
                        </p>
                    </div>
                </div>

                {/* 문장 표시 영역 (오버레이 방식) */}
                <div
                    className="rounded-lg shadow-lg p-6 mb-4 keycap-card"
                    style={{ backgroundColor: 'var(--card-bg)' }}
                >
                    {renderOverlaySentence()}
                </div>

                {/* 숨겨진 입력창 (포커스용) */}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isCompleted}
                    className="opacity-0 absolute"
                    autoComplete="off"
                    autoFocus
                />

                {/* 완료 시 */}
                {isCompleted && (
                    <div className="mt-6 text-center">
                        <p className="text-lg mb-4" style={{ color: 'var(--primary)' }}>
                            완료!
                        </p>
                        <KeycapButton
                            onClick={handleNextSentence}
                            variant="primary"
                            size="md"
                        >
                            다음 문장
                        </KeycapButton>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PracticePage;
