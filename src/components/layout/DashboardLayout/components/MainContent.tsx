import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      {children}
    </div>
  );
};

export default MainContent;