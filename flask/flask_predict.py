from flask import Flask, request, jsonify
import json
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.impute import SimpleImputer

# Flask 앱 초기화
app = Flask(__name__)

# 1. JSON에서 모델 파라미터와 피처 이름 로드
with open('C:/desktop/cowcow/flask/model_metadata1.json', 'r') as f:
    model_data = json.load(f)

# GradientBoostingRegressor에 유효한 파라미터만 필터링
valid_params = GradientBoostingRegressor().get_params().keys()
params = {k: v for k, v in model_data["params"].items() if k in valid_params}

feature_names = model_data["feature_names"]  # 피처 이름

# 2. 모델 재생성
model = GradientBoostingRegressor(**params)
print("모델이 성공적으로 재생성되었습니다.")

# 결측치 처리기 생성
imputer = SimpleImputer(strategy='mean')

# 3. 기본 경로("/") 정의
@app.route('/', methods=['GET'])
def home():
    return "Flask 서버가 정상적으로 실행 중입니다. /predict 엔드포인트를 사용하세요."

# 4. 예측 API 정의
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 클라이언트로부터 JSON 데이터 수신
        data = request.json  
        df = pd.DataFrame([data])  # DataFrame으로 변환

        # 피처 이름에 맞게 정렬
        df = df.reindex(columns=feature_names, fill_value=0)

        # 결측치 처리
        features_imputed = imputer.transform(df)

        # 예측 수행
        prediction = model.predict(features_imputed)

        # 예측 결과 반환
        return jsonify({'predicted_price': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)})

# 5. Flask 서버 실행
if __name__ == '__main__':
    print("Flask 서버 실행 중...")
    app.run(host='0.0.0.0', port=8081)
