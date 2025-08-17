"use client";

import React from 'react';
import { UserProfileDropdownProps } from './types';
import { useUserProfile } from './hooks/useUserProfile';
import useOutsideClick from '../../../hooks/useOutsideClick';

import UserInfo from './components/UserInfo';
import MenuSection from './components/MenuSection';
import LogoutButton from './components/LogoutButton';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose, userData }) => {
  const { user, isLoading, error, handleLogout, getDisplayName } = useUserProfile(isOpen);
  const dropdownRef = useOutsideClick(onClose);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 rounded-md bg-slate-900 shadow-xl border border-slate-700 z-50 overflow-hidden"
      style={{ animation: 'fadeIn 0.15s ease-out' }}
    >
      <div className="text-lg font-medium text-white px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        User
        <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
          <span className="sr-only">Close panel</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : user ? (
        <>
          <UserInfo user={user} getDisplayName={getDisplayName} />
          <MenuSection onClose={onClose} />
          <LogoutButton onLogout={handleLogout} />
        </>
      ) : (
        <div className="p-4 text-center text-slate-400">
          No user information available
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfileDropdown;