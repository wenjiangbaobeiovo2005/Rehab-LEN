import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { UploadZoneProps } from '../../types';

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/avi': ['.avi']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500 text-lg">释放文件以上传</p>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center py-6">
            <svg 
              className="w-12 h-12 mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              <span className="font-semibold">点击上传</span> 或拖拽视频文件到此处
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              支持 MP4 和 AVI 格式
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadZone;