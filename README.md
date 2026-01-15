# 키배온 (KBO)

**Keyboard Battle Online**

끄투의 타자연습 버전으로, 타자 대결을 할 수 있는 온라인 멀티플레이어 게임입니다.
혼자 타자 연습하면 심심하니까요!

![Project Status](https://img.shields.io/badge/status-in_development-yellow)
![Backend](https://img.shields.io/badge/backend-Spring_Boot-green)
![Frontend](https://img.shields.io/badge/frontend-React_+_Vite-blue)

## 📋 목차

- [기술 스택](#-기술-스택)
- [현재 구현된 기능](#-현재-구현된-기능)
- [계획 중인 기능](#-계획-중인-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 환경 설정](#️-개발-환경-설정)
- [API 엔드포인트](#-api-엔드포인트)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [다음 작업 단계](#-다음-작업-단계)

## 🛠 기술 스택

### 백엔드
- **프레임워크**: Spring Boot 4.0.0
- **언어**: Java 17
- **빌드 도구**: Gradle
- **주요 라이브러리**:
  - Spring Data JPA (ORM)
  - Spring Security (인증/인가)
  - JWT (io.jsonwebtoken 0.11.5)
  - MySQL Connector
  - Lombok
  - Spring WebSocket (추가 예정)

### 프론트엔드
- **프레임워크**: React 19.2.0
- **언어**: TypeScript
- **빌드 도구**: Vite 7.2.4
- **주요 라이브러리**:
  - React Router DOM 7.9.6
  - Axios 1.13.2

### 데이터베이스
- **DBMS**: MySQL
- **포트**: 3306
- **데이터베이스명**: kibaeon

## ✅ 현재 구현된 기능

### 1. 회원가입 및 로그인 시스템
- ✅ 이메일 기반 회원가입
  - 이메일 중복 확인
  - 비밀번호 유효성 검증 (8-20자)
  - 닉네임 중복 확인 (2-10자)
  - BCrypt 암호화
- ✅ JWT 기반 로그인
  - 토큰 발급 및 자동 갱신
  - 로컬 스토리지 저장
  - Bearer Token 방식
  - 24시간 유효 기간

### 2. 캐릭터 시스템
- ✅ 3가지 캐릭터 선택 가능
  - [ㅁ] 키캡
  - [ㅇ] 키캡
  - [ㅅ] 키캡
- ✅ 픽셀 아트 스타일 렌더링
- ✅ 캐릭터별 이미지 에셋

### 3. 로비 시스템 (부분 완성)
- ✅ 사용자 정보 표시
  - 닉네임
  - 선택한 캐릭터
  - 총 게임 수
  - 승수
  - 승률 (자동 계산)
- ✅ 로그아웃 기능

### 4. 보안
- ✅ CORS 설정
- ✅ JWT 인증 필터
- ✅ 비밀번호 암호화
- ✅ 환경 변수 기반 Secret 관리

## 🚀 계획 중인 기능

### 기본 기능
- [ ] **1:1 배틀 모드**: 두 플레이어가 실시간으로 타자 대결
- [ ] **방 만들기**: 커스텀 방 생성 및 친구 초대
- [ ] **연습 모드**: 혼자서 타자 연습
- [ ] **프로필 페이지**: 상세 전적 및 통계 확인
- [ ] **전적 저장**: 게임 결과 자동 저장 및 통계 업데이트
- [ ] **문장 랜덤 제공**: 다양한 타자 연습 문장 데이터베이스

### 확장 기능 (아이디어)
- [ ] **한마음 모드** (팀 배틀)
  - 4명으로 이루어진 두 팀 대결
  - 5초마다 팀원 자동 교체
  - 팀 협동 플레이

- [ ] **기억력 모드**
  - 문장을 3초간 보여주고 가림
  - 기억을 통한 타이핑 도전

- [ ] **실시간 랭킹 시스템**
- [ ] **업적 시스템**
- [ ] **친구 시스템**

## 📂 프로젝트 구조

```
kibaeon/
├── kibaeon-backend/              # Spring Boot 백엔드
│   ├── src/main/java/com/kibaeon/backend/
│   │   ├── config/               # 보안, JWT 설정
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtTokenProvider.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   └── user/                 # 사용자 도메인
│   │       ├── User.java         # User 엔티티
│   │       ├── UserController.java
│   │       ├── UserService.java
│   │       ├── UserRepository.java
│   │       └── dto/              # 요청/응답 DTO
│   └── src/main/resources/
│       └── application.yml       # 애플리케이션 설정
│
└── kibaeon-frontend/             # React 프론트엔드
    └── src/
        ├── api/                  # Axios 설정
        │   └── axios.ts          # JWT 인터셉터
        ├── assets/               # 정적 파일
        │   └── characters/       # 캐릭터 이미지
        ├── components/           # 재사용 컴포넌트
        │   ├── CharacterDisplay.tsx
        │   └── RequireAuth.tsx   # 인증 가드
        ├── constants/            # 상수 정의
        │   ├── character.ts
        │   └── characterMap.ts
        └── pages/                # 페이지 컴포넌트
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            └── LobbyPage.tsx
```

## ⚙️ 개발 환경 설정

### 사전 요구사항
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Gradle

### 백엔드 설정

1. **MySQL 데이터베이스 생성**
   ```sql
   CREATE DATABASE kibaeon;
   ```

2. **환경 변수 설정**

   `kibaeon-backend/src/main/resources/application.yml` 파일에서 다음 설정을 확인:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/kibaeon
       username: [MySQL 사용자명]
       password: [MySQL 비밀번호]

   jwt:
     secret: [JWT Secret Key]
   ```

3. **백엔드 실행**
   ```bash
   cd kibaeon-backend
   ./gradlew bootRun
   ```
   - 서버는 `http://localhost:8080`에서 실행됩니다.

### 프론트엔드 설정

1. **의존성 설치**
   ```bash
   cd kibaeon-frontend
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 서버는 `http://localhost:5173`에서 실행됩니다.

## 📡 API 엔드포인트

### 인증 (Authentication)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/register` | 회원가입 | ❌ |
| POST | `/login` | 로그인 | ❌ |
| GET | `/check-email?email={email}` | 이메일 중복 확인 | ❌ |

### 사용자 (User)

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| GET | `/users/me` | 현재 사용자 정보 조회 | ✅ |

### 요청/응답 예시

**회원가입 (POST /register)**
```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "타자왕",
  "characterType": "KEYCAP_01"
}

// Response
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "타자왕",
  "characterType": "KEYCAP_01"
}
```

**로그인 (POST /login)**
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🗄 데이터베이스 스키마

### User 테이블

| 컬럼명 | 타입 | 제약 조건 | 설명 |
|--------|------|-----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 이메일 |
| password | VARCHAR(60) | NOT NULL | 암호화된 비밀번호 |
| nickname | VARCHAR(30) | UNIQUE, NOT NULL | 닉네임 |
| character_type | VARCHAR(20) | NOT NULL | 캐릭터 종류 |
| total_games | INT | NOT NULL, DEFAULT 0 | 총 게임 수 |
| win_count | INT | NOT NULL, DEFAULT 0 | 승리 횟수 |
| max_wpm | INT | NOT NULL, DEFAULT 0 | 최고 WPM |
| average_wpm | DOUBLE | NOT NULL, DEFAULT 0.0 | 평균 WPM |
| created_at | DATETIME | NOT NULL | 생성 일시 |

### 캐릭터 타입

| 값 | 설명 |
|----|------|
| KEYCAP_01 | [ㅁ] 키캡 |
| KEYCAP_02 | [ㅇ] 키캡 |
| KEYCAP_03 | [ㅅ] 키캡 |

## 📝 다음 작업 단계

### 우선순위 1: 방 시스템
- [ ] Room 엔티티 생성
- [ ] 방 생성/삭제 API
- [ ] 방 목록 조회 API
- [ ] 방 참가/퇴장 API
- [ ] 방 상태 관리 (대기, 게임 중)

### 우선순위 2: WebSocket 통신
- [ ] WebSocket 설정 및 핸들러 구현
- [ ] STOMP 메시징 설정
- [ ] 실시간 방 상태 동기화
- [ ] 게임 시작 신호 브로드캐스트

### 우선순위 3: 게임 로직
- [ ] 타자 게임 엔진 구현
- [ ] WPM(분당 타수) 측정 로직
- [ ] 정확도 계산
- [ ] 타이핑 문장 데이터베이스
- [ ] 게임 진행 상황 실시간 동기화
- [ ] 게임 결과 처리 및 전적 업데이트

### 우선순위 4: UI/UX 개선
- [ ] 로비 페이지 방 목록 UI
- [ ] 게임 플레이 화면
- [ ] 결과 화면
- [ ] 프로필 페이지
- [ ] 연습 모드 화면

## 🤝 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다. (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다. (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다. (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다.

## 📄 라이센스

이 프로젝트는 개인 프로젝트입니다.

## 📞 연락처

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**Happy Typing! ⌨️**
