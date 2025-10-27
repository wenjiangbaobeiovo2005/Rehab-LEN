import React, { useState } from 'react';
import FileDropzone from './FileDropzone';
import CameraCapture from './CameraCapture';
import LoadingSpinner from './LoadingSpinner';
import { analyzeVideo } from './services/api';
import type { AnalysisResponse } from './services/api';
import AnalysisResult from './components/ResultCard';

const VideoAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);
  };

  const handleCapture = (image: string) => {
    // In a real implementation, we would convert the image to a video or process it differently
    console.log('Captured image:', image);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeVideo({ video: selectedFile });
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">康复视频分析</h1>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base ${
              activeTab === 'upload' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            上传视频
          </button>
          <button
            className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base ${
              activeTab === 'camera' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('camera')}
          >
            拍摄视频
          </button>
        </div>
        
        <div className="mt-4">
          {activeTab === 'upload' ? (
            <FileDropzone onFileSelect={handleFileSelect} />
          ) : (
            <CameraCapture onCapture={handleCapture} />
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm sm:text-base">
            已选择文件: <span className="font-medium truncate">{selectedFile.name}</span>
          </p>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          错误: {error}
        </div>
      )}

      {analysisResult && (
        <div className="mt-8">
          <AnalysisResult {...analysisResult} />
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;