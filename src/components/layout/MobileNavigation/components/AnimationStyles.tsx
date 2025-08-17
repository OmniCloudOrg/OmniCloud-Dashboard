import React from 'react';

const AnimationStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  );
};

export default AnimationStyles;