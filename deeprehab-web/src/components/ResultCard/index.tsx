import React from 'react';
import * as Icons from '@radix-ui/react-icons';
import type { AnalysisResultProps } from '../../types';

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  score,
  reason,
  angles,
  feedback,
  errors,
  processing_time
}) => {
  const getScoreColor = (scoreValue: number) => {
    switch (scoreValue) {
      case 2:
        return 'bg-green-100 text-green-800';
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 0:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 md:mb-0">康复分析结果</h2>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">FMS评分:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* 评估依据 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Icons.InfoCircledIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">评估依据</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{reason}</p>
        </div>

        {/* 关键角度 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Icons.DotsHorizontalIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">关键角度</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(angles).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize text-sm sm:text-base">{key.replace('_', ' ')}:</span>
                <span className="font-medium text-sm sm:text-base">{value.toFixed(1)}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* 康复建议 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Icons.ChatBubbleIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">康复建议</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{feedback}</p>
        </div>

        {/* 错误分析 */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Icons.ExclamationTriangleIcon className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">错误分析</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(errors).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize text-sm sm:text-base">{key.replace('_', ' ')}:</span>
                  <span className="text-gray-800 text-sm sm:text-base">{typeof value === 'boolean' ? (value ? '是' : '否') : String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 处理时间信息 */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
        <div className="flex items-center text-sm text-gray-500">
          <Icons.ClockIcon className="w-4 h-4 mr-1" />
          <span>处理时间: {processing_time}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;