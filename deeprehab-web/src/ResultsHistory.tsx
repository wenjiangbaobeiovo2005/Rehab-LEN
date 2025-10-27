import React, { useState, useEffect } from 'react';

interface HistoricalResult {
  id: string;
  date: string;
  fileName: string;
  angles: {
    leftKnee: number;
    rightKnee: number;
    leftShoulder: number;
    rightShoulder: number;
  };
  score: number;
}

const ResultsHistory: React.FC = () => {
  const [results, setResults] = useState<HistoricalResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从API获取历史结果
    const fetchResults = async () => {
      try {
        // 模拟数据
        const mockResults: HistoricalResult[] = [
          {
            id: '1',
            date: '2023-06-15',
            fileName: 'patient_session_1.mp4',
            angles: {
              leftKnee: 120.5,
              rightKnee: 118.2,
              leftShoulder: 170.3,
              rightShoulder: 168.7
            },
            score: 8.2
          },
          {
            id: '2',
            date: '2023-06-10',
            fileName: 'patient_session_2.mp4',
            angles: {
              leftKnee: 125.5,
              rightKnee: 123.2,
              leftShoulder: 172.3,
              rightShoulder: 170.1
            },
            score: 8.7
          },
          {
            id: '3',
            date: '2023-06-05',
            fileName: 'patient_session_3.mp4',
            angles: {
              leftKnee: 115.2,
              rightKnee: 113.8,
              leftShoulder: 165.4,
              rightShoulder: 163.9
            },
            score: 7.5
          }
        ];
        
        setResults(mockResults);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
          <div className="text-center py-8">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
        
        {results.length === 0 ? (
          <div className="text-center py-8">
            <p>No analysis results found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Knee Angles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shoulder Angles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      L: {result.angles.leftKnee.toFixed(1)}° / R: {result.angles.rightKnee.toFixed(1)}°
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      L: {result.angles.leftShoulder.toFixed(1)}° / R: {result.angles.rightShoulder.toFixed(1)}°
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        result.score >= 8 
                          ? 'bg-green-100 text-green-800' 
                          : result.score >= 6 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {result.score.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsHistory;