"use client";

import { useState, useEffect } from 'react';

const CreditsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const coreTeam = [
    { name: "Tristan J. Poland", role: "Lead Engineer" },
    { name: "Maxine Deandrade", role: "Backend Engineer" },
    { name: "Thiago Goulart", role: "Backend Engineer" },
    { name: "Colin Leftwich", role: "Backend Engineer" },
    { name: "AbleTheAbove", role: "Backend Engineer" },
    { name: "Caznix", role: "UX Designer" },
    { name: "HaywoodSpartan", role: "Cloud Engineer" },
    { name: "Tyler Poland", role: "Database Engineer" }
  ];

  // Add/remove overflow hidden to body when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Render modal outside the component hierarchy
  const renderModal = () => {
    if (!isOpen) return null;
    
    // This will be rendered at a different DOM level
    return (
      <div 
        id="credits-modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div 
          style={{
            backgroundColor: '#0a1225',
            borderColor: '#132045',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '0.75rem',
            maxWidth: '28rem',
            width: '100%',
            padding: '1.5rem',
            margin: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            zIndex: 10000
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#bfdbfe' }}>OmniCloud Core Team</h3>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ color: '#93c5fd', cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {coreTeam.map((member, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(30, 58, 138, 0.4)',
                    backgroundColor: 'rgba(23, 37, 84, 0.3)'
                  }}
                >
                  <p style={{ color: '#bfdbfe', fontWeight: '500' }}>{member.name}</p>
                  <p style={{ color: '#93c5fd', fontSize: '0.875rem', opacity: '0.8' }}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1.25rem', color: '#bfdbfe', fontSize: '0.875rem', opacity: '0.7' }}>
            <p>OmniCloud Enterprise Edition • v4.2.1</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Create modal element and append to body when needed
  useEffect(() => {
    if (!isOpen) return;
    
    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('credits-modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'credits-modal-container';
      document.body.appendChild(modalContainer);
    }
    
    const modalCleanup = () => {
      if (modalContainer && document.body.contains(modalContainer)) {
        document.body.removeChild(modalContainer);
      }
    };
    
    return modalCleanup;
  }, [isOpen]);
  
  // Update the modal container with React content when open state changes
  useEffect(() => {
    const modalContainer = document.getElementById('credits-modal-container');
    if (!modalContainer) return;
    
    // Simple way to render the modal - in a real app, you'd use createPortal
    modalContainer.innerHTML = '';
    if (isOpen) {
      const modalElement = document.createElement('div');
      modalElement.innerHTML = `
        <div 
          id="credits-modal-overlay"
          style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          "
        >
          <div 
            style="
              background-color: #0a1225;
              border: 1px solid #132045;
              border-radius: 0.75rem;
              max-width: 28rem;
              width: calc(100% - 2rem);
              padding: 1.5rem;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              position: relative;
              z-index: 10000;
            "
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: bold; color: #bfdbfe;">OmniCloud Core Team</h3>
              <button 
                id="close-credits-btn"
                style="color: #93c5fd; cursor: pointer; background: none; border: none;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
                ${coreTeam.map((member) => `
                  <div style="padding: 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(30, 58, 138, 0.4); background-color: rgba(23, 37, 84, 0.3);">
                    <p style="color: #bfdbfe; font-weight: 500;">${member.name}</p>
                    <p style="color: #93c5fd; font-size: 0.875rem; opacity: 0.8;">${member.role}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 1.25rem; color: #bfdbfe; font-size: 0.875rem; opacity: 0.7;">
              <p>OmniCloud Enterprise Edition • v4.2.1</p>
            </div>
          </div>
        </div>
      `;
      modalContainer.appendChild(modalElement);
      
      // Add event listeners
      document.getElementById('credits-modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      });
      
      document.getElementById('close-credits-btn').addEventListener('click', () => {
        setIsOpen(false);
      });
    }
  }, [isOpen]);

  return (
    <button 
      onClick={() => setIsOpen(true)}
      className="text-blue-200 text-xs opacity-40 hover:opacity-80 transition-opacity duration-300 mt-1 underline"
    >
      View Core Team Credits
    </button>
  );
};

export default CreditsPopup;