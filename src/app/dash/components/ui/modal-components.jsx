"use client"

import React from 'react';
import { X } from 'lucide-react';

/**
 * ModalContainer - Base modal container component
 * Used across all dashboard pages for modals
 */
export const ModalContainer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "2xl",
  footer
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-slate-900 border border-slate-800 rounded-xl w-full max-w-${maxWidth} max-h-[90vh] overflow-hidden`}>
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {children}
          
          {footer && (
            <div className="flex justify-end gap-3 mt-8">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * MultiStepProgress - A reusable component for multi-step progress
 * Used in modal forms across dashboard pages
 */
export const MultiStepProgress = ({ step, totalSteps = 3 }) => {
  return (
    <div className="flex items-center mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step === i + 1 
                ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                : step > i + 1 
                  ? 'border-green-500 bg-green-500/20 text-green-400' 
                  : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
          >
            {step > i + 1 ? <CheckIcon size={16} /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`flex-1 h-0.5 ${
              step > i + 1 ? 'bg-green-500/50' : 'bg-slate-700'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * FormField - A reusable form field component
 * Used in modal forms across dashboard pages
 */
export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  rows,
  helpText,
  required = false,
  className = ""
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-1">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      )}
      
      {helpText && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
};

/**
 * ModalFooter - A reusable footer for modals
 * Used in modal forms across dashboard pages
 */
export const ModalFooter = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isMultiStep = false,
  step = 1,
  totalSteps = 3,
  onBack
}) => {
  return (
    <div className="flex justify-between mt-8 w-full">
      {isMultiStep && step > 1 ? (
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          Back
        </button>
      ) : (
        <div></div>
      )}
      
      <div className="flex gap-3 ml-auto">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {cancelText}
        </button>
        
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
        >
          {isMultiStep && step < totalSteps ? "Next" : submitText}
        </button>
      </div>
    </div>
  );
};

// Utility components needed for the modal components
const CheckIcon = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};