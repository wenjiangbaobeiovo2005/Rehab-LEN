import React from 'react';
import AppRouter from './AppRouter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppRouter />
    </div>
  );
};

export default App;