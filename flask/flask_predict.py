from flask import Flask, request, jsonify
from flask_cors import CORS  # CORS 허용을 위한 추가
import json
import os
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.impute import SimpleImputer

# Flask 앱 초기화
app = Flask(__name__)
CORS(app)  # 모든 경로에서 CORS 허용

# JSON 파일 경로 설정 (상대 경로)
base_path = os.path.dirname(os.path.abspath(__file__))
model_metadata_path = os.path.join(base_path, 'model_metadata1.json')

# 1. JSON에서 모델 파라미터와 피처 이름 로드
with open(model_metadata_path, 'r') as f:  # Docker 경로 수정
    model_data = json.load(f)

# GradientBoostingRegressor에 유효한 파라미터만 필터링
valid_params = GradientBoostingRegressor().get_params().keys()
params = {k: v for k, v in model_data["params"].items() if k in valid_params}

feature_names = model_data["feature_names"]  # 피처 이름
print("모델 파라미터와 피처 이름이 성공적으로 로드되었습니다.")

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
        data = request.get_json()
        print("Received data:", data)  # 디버그용 로그

        # 필수 필드 검사
        required_fields = [
            "kpn", "family", "weight", "minValue",
            "성별_수", "성별_암", "성별_프", "종류_혈통우"
        ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # DataFrame으로 변환하고 피처 이름에 맞게 정렬
        df = pd.DataFrame([data])
        df = df.reindex(columns=feature_names, fill_value=0)

        # 결측치 처리
        features_imputed = imputer.fit_transform(df)

        # 예측 수행
        prediction = model.predict(features_imputed)

        # 예측 결과 반환
        return jsonify({'predicted_price': prediction[0]})

    except Exception as e:
        print(f"Error during prediction: {str(e)}")  # 오류 로그 출력
        return jsonify({'error': str(e)}), 500

# 5. Flask 서버 실행
if __name__ == '__main__':
    print("Flask 서버 실행 중...")
    app.run(host='0.0.0.0', port=8081)
