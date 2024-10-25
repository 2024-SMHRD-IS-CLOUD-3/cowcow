FROM python:3.9-slim

WORKDIR /app

# 의존성 설치를 위해 requirements.txt 복사
COPY requirements.txt .

# 필요한 Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Flask 서버 실행
CMD ["python", "flask_predict.py"]
