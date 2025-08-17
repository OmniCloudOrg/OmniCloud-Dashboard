import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const router = useRouter();

  return (
    <div className="p-3 m-2 rounded bg-red-900 bg-opacity-20 border border-red-800">
      <p className="text-red-400 text-sm">{error}</p>
      <button
        onClick={() => router.push('/login')}
        className="mt-2 text-sm text-blue-400 hover:text-blue-300"
      >
        Return to login
      </button>
    </div>
  );
};

export default ErrorState;