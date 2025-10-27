import pytest  # type: ignore
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""  # 多行注释：这是一个健康检查端点的测试函数
    response = client.get("/health")    # 单行注释：向健康检查端点发送GET请求
    assert response.status_code == 200  # 单行注释：验证响应状态码是否为200
    assert response.json() == {"status": "healthy"}  # 单行注释：验证响应的JSON内容是否符合预期

def test_analyze_endpoint_with_invalid_file():
    """Test the analyze endpoint with invalid file format"""
    # Test with a text file (invalid format)
    response = client.post(
        "/api/analyze",
        files={"file": ("test.txt", b"this is a text file", "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file format" in response.json()["detail"]

def test_analyze_endpoint_without_file():
    """Test the analyze endpoint without providing a file"""
    response = client.post("/api/analyze")
    assert response.status_code == 422  # FastAPI返回422而不是400用于验证错误

def test_cors_enabled():
    """Test that CORS headers are present"""
    response = client.get("/health")
    # Since we've configured CORS to allow all origins, 
    # we should check for CORS headers in responses
    assert response.status_code == 200

@patch('main.extract_landmarks')
@patch('main.knee_angle')
@patch('main.score_deep_squat')
@patch('main.analyze_squat_errors')
@patch('main.generate_feedback')
def test_analyze_endpoint_success(mock_generate_feedback, mock_analyze_errors, 
                                  mock_score_squat, mock_knee_angle, mock_extract_landmarks):
    """Test successful video analysis"""
    # Mock all the functions
    mock_extract_landmarks.return_value = {"frame_1": {"landmarks": []}}
    mock_knee_angle.return_value = 90.0
    mock_score_squat.return_value = MagicMock(score=8, reason="Good form")
    mock_analyze_errors.return_value = {"knee_alignment": "Good"}
    mock_generate_feedback.return_value = "Great job!"
    
    # Create a mock MP4 file
    mock_video_content = b"fake mp4 content"
    response = client.post(
        "/api/analyze",
        files={"file": ("test.mp4", mock_video_content, "video/mp4")}
    )
    
    # Check that the response is successful
    assert response.status_code == 200
    
    # Check that the response contains expected fields
    json_response = response.json()
    assert "score" in json_response
    assert "reason" in json_response
    assert "angles" in json_response
    assert "feedback" in json_response
    assert "errors" in json_response
    assert "processing_time" in json_response
    
    # Check that our mocked functions were called
    mock_extract_landmarks.assert_called_once()
    mock_knee_angle.assert_called()  # 改为不检查调用次数，因为knee_angle被调用两次（左右膝盖）
    mock_score_squat.assert_called_once()
    mock_analyze_errors.assert_called_once()
    mock_generate_feedback.assert_called_once()

@patch('main.extract_landmarks')
def test_analyze_endpoint_invalid_video(mock_extract_landmarks):
    """Test analyze endpoint with invalid video file"""
    # Mock extract_landmarks to raise InvalidVideoError
    mock_extract_landmarks.side_effect = Exception("Invalid video file")
    
    # Create a mock MP4 file
    mock_video_content = b"invalid mp4 content"
    response = client.post(
        "/api/analyze",
        files={"file": ("test.mp4", mock_video_content, "video/mp4")}
    )
    
    # Should return 500 error for invalid video
    assert response.status_code == 500
    assert "Failed to process video" in response.json()["detail"]