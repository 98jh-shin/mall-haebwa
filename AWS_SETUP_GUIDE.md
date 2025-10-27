# AWS 설정 가이드

이 문서는 E-Commerce AI 플랫폼을 AWS에 배포하기 위한 설정 가이드입니다.

## 목차
1. [AWS 계정 준비](#1-aws-계정-준비)
2. [IAM 사용자 생성](#2-iam-사용자-생성)
3. [AWS CLI 설정](#3-aws-cli-설정)
4. [향후 사용할 AWS 서비스](#4-향후-사용할-aws-서비스)

---

## 1. AWS 계정 준비

### 1.1 AWS 계정 생성
1. [AWS 공식 웹사이트](https://aws.amazon.com/ko/)에 접속
2. "AWS 계정 생성" 클릭
3. 이메일, 비밀번호, 계정 이름 입력
4. 결제 정보 등록 (프리 티어 사용 가능)
5. 신원 확인 및 계정 활성화

### 1.2 프리 티어 확인
- **EC2**: 750시간/월 (t2.micro 또는 t3.micro)
- **S3**: 5GB 스토리지
- **Lambda**: 100만 요청/월
- **DocumentDB**: 프리 티어 없음 (MongoDB Atlas 고려)

⚠️ **주의**: 프리 티어를 초과하면 과금됩니다!

---

## 2. IAM 사용자 생성

관리자 계정(Root)을 직접 사용하지 않고, 개발용 IAM 사용자를 생성합니다.

### 2.1 IAM 사용자 생성 단계

1. **AWS Console 로그인**
   - https://console.aws.amazon.com/

2. **IAM 서비스로 이동**
   - 검색창에 "IAM" 입력

3. **사용자 추가**
   - 좌측 메뉴: Users → Add users
   - User name: `ecommerce-dev-user`
   - Credential type: Access key - Programmatic access ✅

4. **권한 설정**
   
   **옵션 A: 개발 초기 (간편)**
   - Attach existing policies directly
   - `AdministratorAccess` 선택 (개발 편의성)
   
   **옵션 B: 프로덕션 (권장)**
   - 필요한 서비스만 권한 부여:
     - `AmazonEC2FullAccess`
     - `AmazonS3FullAccess`
     - `AmazonDocumentDBFullAccess`
     - `CloudWatchLogsFullAccess`

5. **태그 추가 (선택사항)**
   - Key: `Environment`, Value: `Development`
   - Key: `Project`, Value: `ECommerceAI`

6. **검토 및 생성**
   - 설정 확인 후 "Create user" 클릭

7. **Access Key 저장** ⚠️ 중요!
   ```
   Access Key ID: AKIA************
   Secret Access Key: **********************
   ```
   - 이 정보는 **다시 확인할 수 없으므로** 안전한 곳에 저장!
   - `.csv` 파일로 다운로드 권장

---

## 3. AWS CLI 설정

로컬 환경에서 AWS 리소스를 관리하기 위한 CLI 설정

### 3.1 AWS CLI 설치

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Windows:**
- [AWS CLI MSI 설치 프로그램](https://awscli.amazonaws.com/AWSCLIV2.msi) 다운로드 및 실행

### 3.2 AWS CLI 구성

```bash
aws configure
```

입력 내용:
```
AWS Access Key ID [None]: AKIA************
AWS Secret Access Key [None]: **********************
Default region name [None]: ap-northeast-2  # 서울 리전
Default output format [None]: json
```

### 3.3 설정 확인

```bash
# 현재 사용자 확인
aws sts get-caller-identity

# S3 버킷 목록 확인 (테스트)
aws s3 ls
```

### 3.4 Multiple Profiles (선택사항)

여러 AWS 계정을 사용하는 경우:

```bash
# 개발 환경
aws configure --profile dev

# 프로덕션 환경
aws configure --profile prod

# 프로필 사용
aws s3 ls --profile dev
```

---

## 4. 향후 사용할 AWS 서비스

프로젝트 진행 중 사용 예정인 AWS 서비스 목록

### 4.1 컴퓨팅
- ✅ **EC2 / ECS Fargate**: Backend API 서버 배포
- ⏳ **Lambda**: 이벤트 기반 처리 (추후 검토)

### 4.2 스토리지
- ✅ **S3**: 
  - Frontend 정적 파일 호스팅
  - 상품 이미지 저장
  - 데이터 백업
- ✅ **CloudFront**: CDN (S3와 연동)

### 4.3 데이터베이스
- ✅ **DocumentDB**: MongoDB 호환 (Vector Search 지원)
- 🔄 **대안**: MongoDB Atlas (프리 티어 이용 가능)

### 4.4 AI/ML
- ⏳ **SageMaker**: 
  - 오픈소스 LLM 배포
  - 임베딩 모델 서빙
- ⏳ **Bedrock**: Claude API 연동 (추후 검토)

### 4.5 네트워킹
- ✅ **VPC**: 프라이빗 네트워크 구성
- ✅ **Application Load Balancer**: 로드 밸런싱
- ✅ **Route 53**: 도메인 관리 (선택사항)

### 4.6 캐싱
- ⏳ **ElastiCache (Redis)**: 
  - 세션 관리
  - RAG 결과 캐싱

### 4.7 모니터링
- ✅ **CloudWatch**: 로그 및 모니터링
- ⏳ **X-Ray**: 분산 추적 (선택사항)

---

## 5. 비용 관리

### 5.1 예산 알림 설정

1. **Billing Dashboard 이동**
   - https://console.aws.amazon.com/billing/

2. **Budgets 생성**
   - Budgets → Create budget
   - Template: Zero spend budget (프리 티어 초과 시 알림)
   - 또는 Custom budget: 월 $10, $50 등 설정

3. **이메일 알림 설정**
   - Actual: 80%, 100% 도달 시
   - Forecasted: 100% 예상 시

### 5.2 비용 최적화 팁

- **불필요한 리소스 즉시 삭제**
  - EC2 인스턴스 중지/종료
  - S3 버킷 비우기
  - Load Balancer 삭제

- **리전 선택**
  - 서울(ap-northeast-2): 가장 가까움, 가격 중간
  - 버지니아(us-east-1): 가장 저렴, 레이턴시 높음

- **프리 티어 모니터링**
  - Billing Dashboard에서 프리 티어 사용량 확인

---

## 6. 보안 Best Practices

### 6.1 Root 계정 보호
- ✅ MFA(다중 인증) 활성화
- ✅ Root 계정 Access Key 생성하지 않기
- ✅ IAM 사용자로만 작업

### 6.2 Access Key 관리
- ❌ **절대 GitHub에 커밋하지 않기**
- ✅ `.env` 파일 사용 (`.gitignore`에 추가됨)
- ✅ AWS Secrets Manager 또는 Parameter Store 사용 (프로덕션)

### 6.3 EC2 보안 그룹
- 필요한 포트만 열기
  - 22 (SSH): 본인 IP만 허용
  - 80, 443 (HTTP/HTTPS): 전체 허용
  - 8000 (Backend): ALB에서만 허용

---

## 7. 다음 단계

- [ ] IAM 사용자 생성 완료
- [ ] AWS CLI 설정 완료
- [ ] S3 버킷 생성 (프론트엔드 배포용)
- [ ] DocumentDB 또는 MongoDB Atlas 선택
- [ ] VPC 및 서브넷 설계
- [ ] CI/CD 파이프라인 구성 (GitHub Actions)

---

## 참고 자료

- [AWS 프리 티어 상세 정보](https://aws.amazon.com/ko/free/)
- [AWS CLI 공식 문서](https://docs.aws.amazon.com/cli/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS 비용 최적화 가이드](https://aws.amazon.com/ko/pricing/cost-optimization/)
