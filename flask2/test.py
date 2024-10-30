#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from pydantic import BaseModel
import cv2
import base64
from queue import Queue
from threading import Thread, Event
import time
import numpy as np
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort
import nest_asyncio
import uvicorn
import logging

logging.getLogger("ultralytics").setLevel(logging.ERROR)
# nest_asyncio 적용하여 중첩 이벤트 루프 허용
nest_asyncio.apply()

# FastAPI 앱 생성
app = FastAPI()

# 초기 변수 설정
rtsp_url = None
max_cows = 6
id_select = None
cap = None
frame_queue = Queue(maxsize=1)
stop_event = Event()  # 이벤트 객체로 초기화
read_thread = None  # 스레드 객체 추가

# YOLO 및 DeepSORT 설정
model = YOLO("runs/detect/train4/weights/best.pt", verbose=False)
tracker = DeepSort(max_age=50, n_init=3)

# ID 매핑 테이블과 관련 변수 설정
tracked_ids = set()
missing_ids = set(range(1, max_cows + 1))
last_known_positions = {}
threshold_distance = 30
id_mapping = {}
reverse_id_mapping = {}

# 그리드 크기 및 영역 정의
grid_size = (4, 4)
frame_height, frame_width = 720, 1280
cell_width = frame_width // grid_size[0]
cell_height = frame_height // grid_size[1]
trapezoid_points = np.array([[0, 750], [400, 50], [1500, 50], [1900, 750]], np.int32)

# 모델 정의
class ConfigInput(BaseModel):
    rtsp_url: str
    max_cows: int

class IdSelectInput(BaseModel):
    id_select: int

# RTSP URL 및 max_cows 설정 엔드포인트
@app.post("/config")
async def set_config(config: ConfigInput):
    global rtsp_url, max_cows, cap, stop_event, read_thread

    # 중복 스트림 방지: 기존 스레드가 있다면 종료하고 새로운 스레드 시작
    stop_event.set()  # 기존 스레드가 있다면 종료하도록 신호 설정
    if read_thread and read_thread.is_alive():
        read_thread.join()  # 기존 스레드가 완전히 종료될 때까지 대기

    # 새로운 스트림 설정
    stop_event.clear()  # 새로운 세션을 위해 stop_event 초기화
    rtsp_url = config.rtsp_url
    max_cows = config.max_cows

    if cap and cap.isOpened():  # 이전에 열린 cap이 있으면 해제
        cap.release()
    cap = cv2.VideoCapture(rtsp_url)
    
    # 새로운 스레드에서 프레임 읽기 시작
    read_thread = Thread(target=read_frames, daemon=True)
    read_thread.start()

    return {"message": "Configuration set successfully"}

# 종료 엔드포인트
@app.post("/stop")
async def stop_stream():
    global stop_event, id_select
    stop_event.set()  # 스레드 종료 신호 설정
    id_select = None  # 종료 시 id_select 초기화
    return {"message": "Streaming stopped"}

# id_select 설정 엔드포인트
@app.post("/set_id")
async def set_id_select(id_input: IdSelectInput):
    global id_select
    id_select = id_input.id_select
    return {"message": f"id_select set to {id_select}"}

# 별도의 스레드에서 프레임을 읽어와 Queue에 저장
# 프레임 읽기 함수
def read_frames():
    global cap
    while not stop_event.is_set():
        if cap and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("프레임을 읽을 수 없습니다.")
                break
            if frame_queue.full():
                frame_queue.get()
            frame_queue.put(frame)
    if cap:
        cap.release()  # 종료 시 cap 해제
        cap = None


# 프레임 처리 및 추적
def process_frame():
    if not frame_queue.empty():
        frame = frame_queue.get()
        results = model(frame)
        detections = []

        for result in results:
            boxes = result.boxes.xyxy.cpu().numpy()
            confidences = result.boxes.conf.cpu().numpy()
            class_ids = result.boxes.cls.cpu().numpy()

            # max_cows만큼의 객체 감지
            for box, conf, class_id in zip(boxes, confidences, class_ids):
                if len(detections) >= max_cows:
                    break
                x1, y1, x2, y2 = map(int, box)
                if is_inside_trapezoid((x1, y1, x2, y2), trapezoid_points):
                    detections.append(([x1, y1, x2, y2], conf, int(class_id)))

        # DeepSORT 트래킹 수행
        tracked_objects = tracker.update_tracks(detections, frame=frame)
        new_tracked_ids = set()

        for track, detection in zip(tracked_objects, detections):
            if track.is_confirmed():
                deep_sort_id = track.track_id
                (x1, y1, x2, y2), conf, class_id = detection  # YOLO 감지 박스 좌표 가져오기
                detected_position = ((x1 + x2) // 2, (y1 + y2) // 2)

                if deep_sort_id not in id_mapping:
                    if missing_ids:
                        new_id = missing_ids.pop()
                        id_mapping[deep_sort_id] = new_id
                        reverse_id_mapping[new_id] = deep_sort_id
                    else:
                        continue

                track_id = id_mapping[deep_sort_id]
                tracked_ids.add(track_id)
                last_known_positions[track_id] = detected_position
                new_tracked_ids.add(track_id)

                # id_select가 없는 경우: YOLO 감지 bounding box와 tracking ID를 모든 객체에 대해 표시
                if id_select is None:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # 초록색 YOLO 감지 박스
                    cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                
                # id_select가 있는 경우: 해당 ID와 일치하는 객체만 YOLO 감지 bounding box와 tracking ID 표시
                elif track_id == id_select:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # 초록색 YOLO 감지 박스
                    cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    break  # id_select와 일치하는 객체가 발견되면 반복 중단

        # 중단된 트래킹 ID 관리
        for old_id in tracked_ids - new_tracked_ids:
            if old_id in reverse_id_mapping:
                deep_sort_id = reverse_id_mapping.pop(old_id)
                missing_ids.add(old_id)
                id_mapping.pop(deep_sort_id, None)

        tracked_ids.clear()
        tracked_ids.update(new_tracked_ids)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_data = base64.b64encode(buffer).decode('utf-8')
        return frame_data
    return None


def is_inside_trapezoid(box, points):
    x1, y1, x2, y2 = box
    center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
    return cv2.pointPolygonTest(points, (center_x, center_y), False) >= 0

# 비디오 피드 엔드포인트
@app.get("/video_feed")
async def video_feed():
    def frame_generator():
        while True:
            frame_data = process_frame()
            if frame_data:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + base64.b64decode(frame_data) + b'\r\n')
            time.sleep(1 / 25)  # FPS 제한
    return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")

# HTML 페이지 엔드포인트
@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Video Feed</title>
            <script>
                async function setConfig() {
                    const rtspUrl = document.getElementById("rtsp_url").value;
                    const maxCows = parseInt(document.getElementById("max_cows").value);

                    const response = await fetch("/config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ rtsp_url: rtspUrl, max_cows: maxCows })
                    });

                    if (response.ok) {
                        window.location.href = "/video_feed";
                    } else {
                        alert("설정을 적용하는 데 실패했습니다.");
                    }
                }

                async function setIdSelect() {
                    const idSelect = parseInt(document.getElementById("id_select").value);

                    await fetch("/set_id", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_select: idSelect })
                    });
                }

                async function stopStream() {
                    const response = await fetch("/stop", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    });
                    if (response.ok) {
                        alert("Streaming stopped");
                        window.location.href = "/";  // 메인 페이지로 이동
                    } else {
                        alert("스트리밍 중지에 실패했습니다.");
                    }
                }
            </script>
        </head>
        <body style="text-align: center;">
            <h1>Live Video Feed</h1>
            <img src="/video_feed" style="width:80%; border: 1px solid #000;" />

            <h2>Configuration</h2>
            <label>RTSP URL: </label><input type="text" id="rtsp_url" placeholder="Enter RTSP URL" /><br>
            <label>Max Cows: </label><input type="number" id="max_cows" placeholder="Enter max cows" /><br>
            <button onclick="setConfig()">Set Config</button>

            <h2>ID Select</h2>
            <label>ID Select: </label><input type="number" id="id_select" placeholder="Enter ID to select" /><br>
            <button onclick="setIdSelect()">Set ID Select</button>

            <h2>Stop Streaming</h2>
            <button onclick="stopStream()">Stop Stream</button>
        </body>
    </html>
    """


# uvicorn을 통해 FastAPI 앱 실행
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)


# In[ ]:




