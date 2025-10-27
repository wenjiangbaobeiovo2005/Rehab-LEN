import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const startCapture = () => {
    setCapturing(true);
  };

  const stopCapture = () => {
    setCapturing(false);
    capture();
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const videoConstraints = {
    width: { min: 480, ideal: 720, max: 1920 },
    height: { min: 360, ideal: 540, max: 1080 },
    facingMode: facingMode
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full rounded-lg shadow-md aspect-video"
        />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={switchCamera}
            className="bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
          
          {capturing ? (
            <button
              onClick={stopCapture}
              className="bg-red-500 bg-opacity-80 text-white rounded-full p-4 hover:bg-opacity-100 transition-all"
            >
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </button>
          ) : (
            <button
              onClick={startCapture}
              className="bg-white bg-opacity-80 text-white rounded-full p-4 hover:bg-opacity-100 transition-all"
            >
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>点击录制按钮开始拍摄，再次点击停止拍摄</p>
        <p className="mt-1">使用摄像头切换按钮切换前后摄像头</p>
      </div>
    </div>
  );
};

export default CameraCapture;