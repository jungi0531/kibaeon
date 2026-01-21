# 키배온 (KIBAEON)

타자 대결을 할 수 있는 온라인 멀티플레이어 게임입니다.

![Status](https://img.shields.io/badge/status-in_development-yellow)

## 🛠 기술 스택

### Backend
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

## 구현 기능

### 회원 인증
- JWT 기반 회원가입 및 로그인
- 이메일/닉네임 중복 확인
- BCrypt 비밀번호 암호화
- 픽셀 아트 캐릭터 선택

### 로비 시스템
- 사용자 프로필 조회 (닉네임, 캐릭터, 전적, 승률)
- 방 생성 및 입장 (공개/비밀번호 설정 가능)
- 방 목록 조회 및 필터링
- Redis 기반 실시간 방 관리

### 방 시스템
- 실시간 플레이어 목록 동기화
- 플레이어 상세 정보 모달
- 방 나가기 및 자동 방장 위임

---