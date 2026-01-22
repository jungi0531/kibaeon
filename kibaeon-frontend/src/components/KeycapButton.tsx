// src/components/KeycapButton.tsx

import { ButtonHTMLAttributes, useState } from 'react';
import { playKeyboardSound } from '../utils/sound';

interface KeycapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  worn?: boolean; // 사용감 표현 (마모된 느낌)
  children: React.ReactNode;
}

function KeycapButton({
  variant = 'primary',
  size = 'md',
  worn = false,
  children,
  onClick,
  disabled,
  className = '',
  ...props
}: KeycapButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playKeyboardSound(); // 클릭 시 사운드 재생
      onClick?.(e); // 원래 onClick 실행
    }
  };

  // variant별 색상 설정 (빈티지 키캡 느낌)
  const variantStyles = {
    primary: {
      backgroundColor: worn ? '#DEC8A0' : '#EBD9B4', // 마모된 버전은 약간 어둡게
      color: 'var(--text-title)',
      border: '3px solid #4A3F35',
    },
    secondary: {
      backgroundColor: worn ? '#C4B498' : '#D4C4A8',
      color: 'var(--text-title)',
      border: '3px solid #4A3F35',
    },
    danger: {
      backgroundColor: worn ? '#D8A898' : '#E8B8A8',
      color: 'var(--text-title)',
      border: '3px solid #8B4545',
    },
    neutral: {
      backgroundColor: worn ? '#B9AC96' : '#C9BCA6',
      color: 'var(--text-title)',
      border: '3px solid #6F6A5E',
    },
  };

  // size별 크기 설정
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // 눌림 상태에 따른 그림자 변경 (키캡 눌림 효과)
  const getShadow = () => {
    if (disabled) {
      return '0 2px 4px rgba(0,0,0,0.1)';
    }
    if (isPressed) {
      // 눌렀을 때: 그림자 거의 없음
      return '0 1px 0 rgba(0,0,0,0.3), 0 2px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)';
    }
    // 기본 상태: 5px 그림자
    return '0 5px 0 rgba(0,0,0,0.3), 0 7px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)';
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      className={`
        ${sizeStyles[size]}
        font-semibold
        rounded-lg
        transition-all
        duration-100
        keycap-text
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        ...variantStyles[variant],
        boxShadow: getShadow(),
        borderRadius: '8px',
        transform: isPressed ? 'translateY(4px)' : disabled ? 'none' : undefined,
        // 마모된 느낌: 미묘한 텍스처 추가
        backgroundImage: worn
          ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)'
          : undefined,
        ...(props.style || {}),
      }}
    >
      {children}
    </button>
  );
}

export default KeycapButton;
