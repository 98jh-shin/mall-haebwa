# Node.js 베이스 이미지
FROM node:20-alpine

RUN apk add --no-cache git python3 make g++


# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 개발 서버 포트
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
