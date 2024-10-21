# NestJS를 위한 Node.js 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# package.json과 관련 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 코드 복사
COPY . .

# 컨테이너가 사용할 포트
EXPOSE 3001

# 개발 모드 실행 (핫 리로딩을 위해)
CMD ["npm", "run", "start:dev"]
