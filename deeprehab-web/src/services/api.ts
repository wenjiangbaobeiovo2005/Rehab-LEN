// 定义类型
export interface AnalysisRequest {
  video: File;
}

export interface AnalysisResponse {
  score: number;
  reason: string;
  angles: Record<string, number>;
  feedback: string;
  errors?: Record<string, unknown>;
  processing_time: string;
}

// 实现分析视频函数
export const analyzeVideo = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  // 根据环境变量获取后端地址
  // 在生产环境中通过环境变量指定后端URL，开发环境中使用默认值
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // 创建FormData对象用于文件上传
  const formData = new FormData();
  formData.append('file', request.video);
  
  // 发送POST请求到后端分析端点
  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  // 检查响应状态
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // 解析并返回响应数据
  const data: AnalysisResponse = await response.json();
  return data;
};