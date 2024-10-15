# React를 위한 Node.js 기반 이미지 사용
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx로 정적 파일 제공
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
