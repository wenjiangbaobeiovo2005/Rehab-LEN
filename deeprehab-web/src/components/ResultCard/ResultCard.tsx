import React from 'react';
import type { AnalysisResultProps as AnalysisResult } from '../../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Joint Angles</h3>
          <div className="space-y-2">
            {Object.entries(result.angles).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium">{value.toFixed(1)}°</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Assessment</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-medium">{result.score}/3</span>
            </div>
            <div>
              <span className="block font-medium">Reason:</span>
              <p className="mt-1 text-gray-700">{result.reason}</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Feedback</h3>
          <p className="text-gray-700">{result.feedback}</p>
        </div>
        
        {result.errors && Object.keys(result.errors).length > 0 && (
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Errors Detected</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(result.errors).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className={value ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                    {value ? 'Yes' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 text-right">
        Processing time: {result.processing_time}
      </div>
    </div>
  );
};

export default ResultCard;