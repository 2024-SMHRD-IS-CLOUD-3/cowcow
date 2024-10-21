# React를 위한 Node.js 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 개발 서버 실행 (Hot Reload 지원)
CMD ["npm", "start"]
