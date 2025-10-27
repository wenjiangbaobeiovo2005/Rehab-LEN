from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import time
from typing import Dict, Any

app = FastAPI()

# 添加CORS中间件以允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "DeepRehab Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_video(file: UploadFile = File(...)):
    # 记录处理开始时间
    start_time = time.time()
    
    # 模拟视频分析过程
    # 在实际应用中，这里会调用deeprehab-pose和deeprehab-angles等模块
    
    # 模拟分析结果
    result = {
        "score": random.randint(7, 10),
        "reason": "Good form overall with minor deviations",
        "angles": {
            "left_knee": round(random.uniform(110, 140), 1),
            "right_knee": round(random.uniform(110, 140), 1)
        },
        "feedback": "Good form overall. Keep your knees aligned with your toes during squats.",
        "errors": {
            "knee_alignment": "Minor misalignment detected",
            "shoulder_position": "Slight deviation from optimal position"
        },
        "processing_time": f"{time.time() - start_time:.2f}s"
    }
    
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)