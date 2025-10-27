# 의도 기반 E-Commerce AI 플랫폼

RAG와 AI 에이전트를 통합한 사용자 의도 이해 기반 쇼핑몰 플랫폼

## 프로젝트 개요

사용자의 '의도'를 이해하는 AI 검색 비서가 탑재된 E-Commerce 플랫폼입니다.
예: "김치찌개 먹고 싶다" → AI가 밀키트와 재료 옵션 제안

## 기술 스택

### 확정된 스택
- **Frontend**: React
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

### 추후 결정 예정
- AI/LLM 서비스
- 클라우드 인프라
- 벡터 검색 엔진
- 캐싱 솔루션

## 프로젝트 구조

```
ecommerce-ai-platform/
├── frontend/          # React 애플리케이션
├── backend/           # FastAPI 애플리케이션
└── docker-compose.yml # 로컬 개발환경
```

## 시작하기

### 사전 요구사항
- Docker & Docker Compose
- Git

### 로컬 개발환경 실행

1. 저장소 클론
```bash
git clone <repository-url>
cd ecommerce-ai-platform
```

2. 환경변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 값 설정
```

3. Docker Compose로 실행
```bash
docker-compose up -d
```

4. 접속
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 개발 중단
```bash
docker-compose down
```

## 주요 기능

1. **내부 RAG 하이브리드 검색**
   - 키워드 검색 + 벡터 검색 통합
   - 사용자 의도 기반 상품 추천

2. **외부 Claude AI 에이전트 연동**
   - MCP 프로토콜 기반
   - 원격 API 호출 지원

## 3대 핵심 챌린지

1. **RAG 품질**: 데이터 전처리 및 청킹 전략
2. **백엔드 상태 관리**: Redis 세션 기반 컨텍스트 유지
3. **AI 속도/비용**: 지능형 캐싱 전략

## 라이선스

TBD

## 기여

TBD
