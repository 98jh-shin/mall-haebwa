# GitHub 설정 가이드

이 문서는 E-Commerce AI 플랫폼의 Git 버전 관리 및 GitHub 설정 가이드입니다.

## 목차
1. [Git 설치 및 초기 설정](#1-git-설치-및-초기-설정)
2. [로컬 저장소 초기화](#2-로컬-저장소-초기화)
3. [GitHub 저장소 생성 및 연결](#3-github-저장소-생성-및-연결)
4. [브랜치 전략](#4-브랜치-전략)
5. [협업 가이드](#5-협업-가이드)

---

## 1. Git 설치 및 초기 설정

### 1.1 Git 설치

**macOS:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

**Windows:**
- [Git for Windows](https://git-scm.com/download/win) 다운로드 및 설치

### 1.2 Git 사용자 정보 설정

```bash
# 사용자 이름 설정
git config --global user.name "Your Name"

# 이메일 설정 (GitHub 이메일과 동일하게)
git config --global user.email "your.email@example.com"

# 설정 확인
git config --list
```

### 1.3 기본 에디터 설정 (선택사항)

```bash
# VS Code를 기본 에디터로 설정
git config --global core.editor "code --wait"

# Vim을 기본 에디터로 설정
git config --global core.editor "vim"
```

---

## 2. 로컬 저장소 초기화

프로젝트 루트 디렉토리에서:

```bash
# 프로젝트 디렉토리로 이동
cd ecommerce-ai-platform

# Git 저장소 초기화
git init

# 현재 상태 확인
git status

# 모든 파일 스테이징
git add .

# 첫 번째 커밋
git commit -m "Initial commit: 프로젝트 초기 설정

- React 프론트엔드 기본 구조
- FastAPI 백엔드 기본 구조
- Docker Compose 개발환경 설정
- MongoDB 연동 준비
- README 및 문서 추가"
```

---

## 3. GitHub 저장소 생성 및 연결

### 3.1 GitHub 저장소 생성

1. **GitHub 웹사이트 접속**
   - https://github.com 로그인

2. **새 저장소 생성**
   - 우측 상단 `+` 버튼 → `New repository`
   - Repository name: `ecommerce-ai-platform`
   - Description: `RAG와 AI 에이전트를 통합한 의도 기반 E-Commerce 플랫폼`
   - Visibility: 
     - `Private` (비공개) 또는
     - `Public` (공개)
   - ⚠️ **Initialize this repository with** 체크 해제
     - README, .gitignore, license 모두 체크 해제
     - (이미 로컬에 파일이 있으므로)

3. **Create repository** 클릭

### 3.2 원격 저장소 연결

GitHub에서 생성된 저장소 URL을 복사하고:

```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-ai-platform.git

# 또는 SSH 사용 시
git remote add origin git@github.com:YOUR_USERNAME/ecommerce-ai-platform.git

# 원격 저장소 확인
git remote -v

# 메인 브랜치 이름 변경 (main으로 통일)
git branch -M main

# 첫 푸시
git push -u origin main
```

### 3.3 SSH Key 설정 (권장)

매번 비밀번호를 입력하지 않으려면 SSH Key를 설정하세요.

**1. SSH Key 생성:**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Enter 연타 (기본 경로 사용)
```

**2. SSH Key 복사:**
```bash
# macOS
cat ~/.ssh/id_ed25519.pub | pbcopy

# Linux
cat ~/.ssh/id_ed25519.pub
```

**3. GitHub에 등록:**
- GitHub Settings → SSH and GPG keys → New SSH key
- Title: `My Laptop` 등
- Key: 복사한 내용 붙여넣기
- Add SSH key

**4. 연결 테스트:**
```bash
ssh -T git@github.com
# "Hi username! You've successfully authenticated..." 메시지 확인
```

---

## 4. 브랜치 전략

Git Flow를 단순화한 브랜치 전략 사용

### 4.1 브랜치 구조

```
main (프로덕션)
 ├── develop (개발)
 │    ├── feature/user-auth
 │    ├── feature/product-search
 │    └── feature/rag-integration
 └── hotfix/critical-bug
```

### 4.2 브랜치별 역할

- **main**: 
  - 항상 배포 가능한 상태
  - 직접 커밋 금지
  - develop 또는 hotfix에서만 병합

- **develop**:
  - 개발 브랜치
  - feature 브랜치의 병합 대상
  - 테스트 완료 후 main으로 병합

- **feature/***:
  - 새로운 기능 개발
  - develop에서 분기
  - 완료 후 develop으로 병합
  - 예: `feature/mongodb-setup`, `feature/rag-search`

- **hotfix/***:
  - 긴급 버그 수정
  - main에서 분기
  - 완료 후 main과 develop에 모두 병합

### 4.3 브랜치 명명 규칙

```bash
feature/기능명        # 새 기능
bugfix/버그명         # 버그 수정
hotfix/긴급수정명     # 긴급 수정
refactor/리팩토링명   # 코드 개선
docs/문서명           # 문서 작업
```

### 4.4 브랜치 작업 플로우

**새 기능 개발:**
```bash
# develop 브랜치로 이동
git checkout develop

# 최신 상태로 업데이트
git pull origin develop

# 새 feature 브랜치 생성
git checkout -b feature/product-api

# 작업 후 커밋
git add .
git commit -m "feat: 상품 목록 API 구현"

# 원격에 푸시
git push origin feature/product-api

# GitHub에서 Pull Request 생성
# develop ← feature/product-api
```

---

## 5. 협업 가이드

### 5.1 커밋 메시지 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 사용

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 설정 변경

**예시:**
```bash
git commit -m "feat(backend): MongoDB 연결 설정 추가"
git commit -m "fix(frontend): 검색창 한글 입력 버그 수정"
git commit -m "docs: AWS 설정 가이드 업데이트"
```

### 5.2 Pull Request 규칙

**PR 제목:**
```
[Backend] 상품 검색 API 구현
[Frontend] 상품 목록 UI 개발
[Infra] Docker Compose 설정 개선
```

**PR 설명 템플릿:**
```markdown
## 변경 사항
- 상품 검색 API 엔드포인트 추가
- MongoDB 쿼리 최적화

## 테스트
- [ ] 로컬 테스트 완료
- [ ] API 문서 확인

## 스크린샷 (UI 변경 시)
[스크린샷 첨부]

## 관련 이슈
Closes #123
```

### 5.3 코드 리뷰 가이드

**리뷰어:**
- 기능 동작 확인
- 코드 품질 검토
- 성능 및 보안 검토
- 건설적인 피드백 제공

**작성자:**
- 피드백 적극 반영
- 변경 사항 명확히 설명
- 리뷰 완료 후 병합

### 5.4 자주 사용하는 Git 명령어

```bash
# 현재 상태 확인
git status

# 변경 사항 스테이징
git add .
git add 파일명

# 커밋
git commit -m "메시지"

# 브랜치 목록
git branch

# 브랜치 전환
git checkout 브랜치명
git switch 브랜치명  # 최신 방식

# 새 브랜치 생성 및 전환
git checkout -b 새브랜치명
git switch -c 새브랜치명  # 최신 방식

# 원격 저장소에서 가져오기
git pull origin 브랜치명

# 원격 저장소로 푸시
git push origin 브랜치명

# 브랜치 병합
git merge 브랜치명

# 마지막 커밋 수정
git commit --amend

# 변경 사항 임시 저장
git stash
git stash pop

# 로그 확인
git log
git log --oneline
git log --graph
```

---

## 6. .gitignore 주의사항

이미 생성된 `.gitignore` 파일은 다음을 제외합니다:

✅ **반드시 제외해야 할 항목:**
- `.env` - 환경변수 (AWS 키, DB 비밀번호 등)
- `node_modules/` - npm 패키지
- `__pycache__/` - Python 캐시
- `venv/` - Python 가상환경
- `.DS_Store` - macOS 시스템 파일

❌ **절대 커밋하면 안 되는 것:**
- AWS Access Key / Secret Key
- Database 비밀번호
- API Keys (OpenAI, Claude 등)
- `.pem` 파일 (SSH 키)

---

## 7. GitHub Actions (추후 설정)

CI/CD 파이프라인을 위한 GitHub Actions 설정 예정:

- ✅ 자동 테스트 실행
- ✅ 코드 린팅
- ✅ Docker 이미지 빌드
- ✅ AWS 자동 배포

---

## 8. 다음 단계

- [ ] GitHub 저장소 생성 완료
- [ ] 로컬 저장소와 연결 완료
- [ ] develop 브랜치 생성
- [ ] 첫 번째 PR 작성 및 병합 테스트
- [ ] 팀원 초대 (Settings → Collaborators)

---

## 참고 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
