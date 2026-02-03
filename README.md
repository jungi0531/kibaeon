# 🎮 KIBAEON (키배온)

<div align="center">
<img width="329" src="https://github.com/user-attachments/assets/ac3ec0aa-1a93-48d6-971c-11496afc4c5a" />

**실시간 타자 대결 온라인 멀티플레이어 게임**

</div>

## 배포 주소

> **개발 버전** : 준비 중 <br>

## 개발자 소개

|     홍준기     |
| :-----------: |
| [@jungi0531](https://github.com/jungi0531) |
| 경북대학교<br>컴퓨터학부 3학년 |
| Full Stack |

## 프로젝트 소개

키배온(KIBAEON)은 **실시간으로 타자 대결**을 할 수 있는 온라인 멀티플레이어 게임입니다.

**주요 특징:**
- ⌨️ 실시간 타자 대결 (1:1 ~ 6인)
- 🎨 귀여운 픽셀 아트 키캡 캐릭터
- 🏆 승률 및 전적 관리
- 🔒 공개/비공개 방 설정
- 🎯 연습 모드 지원

## Stacks

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

### Deployment
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

### Communication
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

---

## 화면 구성

| 로그인 페이지  |  회원가입 페이지   |
| :-------------------------------------------: | :------------: |
|  <img width="329" src=""/> | <img width="329" src=""/> |
| 로비 페이지   |   대기실 페이지   |
| <img width="329" src="" /> | <img width="329" src="" /> |
| 연습 모드 페이지   |   게임 페이지   |
| <img width="329" src="" /> | <img width="329" src="" /> |

---

## 주요 기능

### ⭐️ 회원 인증
- JWT 기반 회원가입 및 로그인
- 이메일/닉네임 중복 확인
- BCrypt 비밀번호 암호화
- 픽셀 아트 키캡 캐릭터 선택

### ⭐️ 로비 시스템
- 사용자 프로필 조회 (닉네임, 캐릭터, 전적, 승률)
- 방 생성 및 입장 (공개/비밀번호 설정)
- 방 목록 실시간 조회
- Redis 기반 실시간 방 관리

### ⭐️ 방 시스템
- 실시간 플레이어 목록 동기화
- 플레이어 상세 정보 모달
- 방 나가기 및 자동 방장 위임

### ⭐️ 연습 모드
- 랜덤 문장 타이핑 연습
- 한글 자소 기반 타수 계산 (한컴타자연습 방식)
- 정확도 측정 (한글 조합 상태 고려)
- 키보드 사운드 효과 (Web Audio API)

---

## 디렉토리 구조

```bash
├── README.md
├── kibaeon-frontend/               # 프론트엔드 (React + TypeScript)
│   ├── src/
│   │   ├── api/                    # API 통신 (Axios)
│   │   ├── assets/                 # 이미지, 사운드 리소스
│   │   ├── components/             # 재사용 컴포넌트
│   │   │   ├── CharacterCarousel.tsx
│   │   │   ├── CharacterDisplay.tsx
│   │   │   ├── KeycapButton.tsx
│   │   │   ├── LoadingKeycaps.tsx
│   │   │   ├── RequireAuth.tsx
│   │   │   └── SettingsButton.tsx
│   │   ├── pages/                  # 페이지
│   │   │   ├── LoginPage.tsx       # 로그인
│   │   │   ├── RegisterPage.tsx    # 회원가입
│   │   │   ├── LobbyPage.tsx       # 로비
│   │   │   ├── RoomPage.tsx        # 대기실
│   │   │   └── PracticePage.tsx    # 연습 모드
│   │   └── utils/                  # 유틸리티
│   │       └── sound.ts            # 사운드 관리
│   └── package.json
│
└── kibaeon-backend/                # 백엔드 (Spring Boot)
    ├── src/main/java/com/kibaeon/backend/
    │   ├── config/                 # 설정
    │   │   ├── SecurityConfig.java
    │   │   ├── RedisConfig.java
    │   │   ├── JwtTokenProvider.java
    │   │   └── JwtAuthenticationFilter.java
    │   ├── user/                   # 유저 도메인
    │   │   ├── User.java
    │   │   ├── UserController.java
    │   │   ├── UserService.java
    │   │   ├── UserRepository.java
    │   │   └── dto/
    │   ├── room/                   # 방 도메인
    │   │   ├── Room.java
    │   │   ├── RoomController.java
    │   │   ├── RoomService.java
    │   │   └── dto/
    │   └── sentence/               # 문장 도메인
    │       ├── Sentence.java
    │       ├── SentenceController.java
    │       ├── SentenceService.java
    │       ├── SentenceRepository.java
    │       └── dto/
    └── build.gradle
```

---

## 실행 방법

### Backend

```bash
cd kibaeon-backend
./gradlew bootRun
```

### Frontend

```bash
cd kibaeon-frontend
npm install
npm run dev
```

---
