import React from 'react';
import Webcam from 'react-webcam';
import type { CameraViewProps } from '../../types';

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        className="rounded-lg shadow-md"
      />
      
      <div className="mt-4">
        <button
          onClick={() => onCapture('')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Capture Frame
        </button>
      </div>
    </div>
  );
};

export default CameraView;