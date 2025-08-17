import React from 'react';
import { UserData } from '../types';

interface UserInfoProps {
  user: UserData;
  getDisplayName: (user: UserData | null) => string;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, getDisplayName }) => {
  return (
    <div className="px-4 py-3 border-b border-slate-700">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md text-base">
          {getDisplayName(user).substring(0, 2).toUpperCase()}
        </div>
        <div className="ml-3 overflow-hidden">
          <h3 className="text-base font-medium text-white truncate">
            {getDisplayName(user)}
          </h3>
          <p className="text-sm text-slate-400 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;