import os
import time
import logging
import tempfile
from typing import Dict, Any, Optional
import uuid
import random

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import the available packages with error handling
try:
    from deeprehab_pose import extract_landmarks, InvalidVideoError  # type: ignore
    from deeprehab_movements import score_deep_squat  # type: ignore
    from deeprehab_visualize import draw_skeleton  # type: ignore
    from deeprehab_angles import knee_angle  # type: ignore
    from deeprehab_rules import ScoreResult  # type: ignore
    from deeprehab_diagnostics import analyze_squat_errors  # Re-added the diagnostics import  # type: ignore
    logger.info("All deeprehab modules imported successfully")
except ImportError as e:
    logger.error(f"Failed to import deeprehab modules: {str(e)}")
    raise ImportError("Required deeprehab modules are not available. Please install them using 'pip install deeprehab-pose deeprehab-movements deeprehab-visualize deeprehab-angles deeprehab-rules deeprehab-diagnostics'")

app = FastAPI(
    title="DeepRehab API",
    description="API for rehabilitation analysis using DeepRehab packages",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该指定确切的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    score: int
    reason: str
    angles: Dict[str, float]
    feedback: str
    errors: Dict[str, Any]
    processing_time: str
    visualization_url: Optional[str] = None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

def generate_feedback(score_result, errors, angles):
    """Generate feedback based on score, errors, and angles"""
    # 使用角度信息提供更具体的反馈
    feedback_parts = []
    
    # 基于评分的基本反馈
    if score_result.score >= 8:
        feedback_parts.append("Good form overall.")
    elif score_result.score >= 6:
        feedback_parts.append("Fair form with room for improvement.")
    else:
        feedback_parts.append("Form needs significant improvement.")
    
    # 基于膝盖角度的具体反馈
    if angles.get("left_knee", 180) < 90 or angles.get("right_knee", 180) < 90:
        feedback_parts.append("Avoid bending your knees beyond 90 degrees.")
    
    # 基于错误分析的具体反馈
    if errors.get("knee_alignment"):
        feedback_parts.append(f"Knee alignment issue: {errors['knee_alignment']}")
    
    if errors.get("shoulder_position"):
        feedback_parts.append(f"Shoulder position issue: {errors['shoulder_position']}")
    
    return " ".join(feedback_parts)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...), include_visualization: bool = False):
    """
    Analyze a rehabilitation video using DeepRehab packages.
    
    Args:
        file: Video file to analyze (MP4 or AVI format)
        include_visualization: Whether to generate and return a visualization
        
    Returns:
        Analysis results including score, feedback, angles, errors, and optionally visualization
    """
    start_time = time.time()
    
    # Validate file format
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
        
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.mp4', '.avi']:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file format. Only MP4 and AVI files are supported."
        )
    
    # Create a temporary file to store the uploaded video
    temp_file_path = None
    visualization_path = None
    try:
        # Generate a unique temporary file name
        temp_file_name = f"temp_video_{uuid.uuid4()}{file_extension}"
        temp_file_path = os.path.join(tempfile.gettempdir(), temp_file_name)
        
        # Save uploaded file to temporary location
        with open(temp_file_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        # Extract landmarks using deeprehab-pose
        try:
            landmarks = extract_landmarks(temp_file_path)
        except InvalidVideoError as e:
            raise HTTPException(status_code=400, detail=f"Invalid video file: {str(e)}")
        except Exception as e:
            logger.error(f"Error extracting landmarks: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to process video")
        
        if not landmarks:
            raise HTTPException(status_code=500, detail="No landmarks detected in video")
        
        # Calculate knee angles using deeprehab-angles
        try:
            # Calculate left and right knee angles
            left_knee_angle = knee_angle(landmarks, side="left")
            right_knee_angle = knee_angle(landmarks, side="right")
            angles = {
                "left_knee": left_knee_angle,
                "right_knee": right_knee_angle
            }
        except Exception as e:
            logger.error(f"Error calculating angles: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to calculate joint angles")
        
        # Score deep squat using deeprehab-movements
        try:
            score_result: ScoreResult = score_deep_squat(landmarks)
        except Exception as e:
            logger.error(f"Error scoring movement: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to score movement")
        
        # Analyze squat errors using deeprehab-diagnostics
        try:
            errors = analyze_squat_errors(landmarks)
        except Exception as e:
            logger.error(f"Error analyzing errors: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to analyze movement errors")
        
        # Generate feedback using our enhanced function
        try:
            feedback = generate_feedback(score_result, errors, angles)
        except Exception as e:
            logger.error(f"Error generating feedback: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to generate feedback")
        
        # Generate visualization if requested
        visualization_url = None
        if include_visualization:
            try:
                # Create a temporary file for the visualization
                vis_filename = f"vis_{uuid.uuid4()}.jpg"
                visualization_path = os.path.join(tempfile.gettempdir(), vis_filename)
                
                # Generate visualization using deeprehab-visualize
                draw_skeleton(landmarks, temp_file_path, visualization_path)
                
                # In a real application, you would upload this to a storage service
                # and return the URL. For now, we'll just return the path.
                visualization_url = f"/api/visualizations/{vis_filename}"
            except Exception as e:
                logger.error(f"Error generating visualization: {str(e)}")
                # Don't fail the entire request if visualization fails
                visualization_url = None
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Return analysis results
        return AnalysisResponse(
            score=score_result.score,
            reason=score_result.reason,
            angles=angles,
            feedback=feedback,
            errors=errors,
            processing_time=f"{processing_time:.2f}s",
            visualization_url=visualization_url
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")
    finally:
        # Clean up temporary files
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_file_path}: {str(e)}")
        
        if visualization_path and os.path.exists(visualization_path):
            try:
                os.remove(visualization_path)
            except Exception as e:
                logger.warning(f"Failed to remove visualization file {visualization_path}: {str(e)}")

@app.get("/api/visualizations/{filename}")
async def get_visualization(filename: str):
    """Serve visualization files"""
    file_path = os.path.join(tempfile.gettempdir(), filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Visualization not found")
    
    return FileResponse(file_path, media_type="image/jpeg")

# 为Render部署添加主入口点
if __name__ == "__main__":
    import uvicorn
    
    # 从环境变量获取端口，Render使用$PORT
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False  # 生产环境禁用热重载
    )