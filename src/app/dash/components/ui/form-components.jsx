"use client"

import React from 'react';

/**
 * FormField - A reusable form field component
 * Used across all dashboard pages in forms
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
  error,
  required = false,
  className = "",
  disabled = false,
  min,
  max,
  step
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-400">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={value}
            onChange={onChange}
            disabled={disabled}
            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
          />
          {placeholder && (
            <label htmlFor={id} className="ml-2 text-sm text-white">
              {placeholder}
            </label>
          )}
        </div>
      ) : type === 'radio' ? (
        <div className="space-y-2">
          {options && options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`${id}-${option.value}`}
                name={id}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
              />
              <label htmlFor={`${id}-${option.value}`} className="ml-2 text-sm text-white">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
      )}
      
      {helpText && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

/**
 * FormGroup - A reusable component for grouping form fields
 * Used to create structured form layouts
 */
export const FormGroup = ({ 
  children, 
  title, 
  description,
  className = "",
  columns = 1
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3"
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      )}
      <div className={`grid ${colClasses[columns]} gap-6`}>
        {children}
      </div>
    </div>
  );
};

/**
 * SearchInput - A reusable search input component
 * Used across dashboard pages for search boxes
 */
export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  onSubmit,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
        >
          <XIcon size={18} />
        </button>
      )}
    </div>
  );
};

/**
 * FilterSelect - A reusable filter select component
 * Used for dropdown filters across dashboard pages
 */
export const FilterSelect = ({ 
  value, 
  onChange, 
  options, 
  label,
  className = "" 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-slate-500 mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * ToggleSwitch - A reusable toggle switch component
 * Used for boolean settings across dashboard pages
 */
export const ToggleSwitch = ({ 
  isOn, 
  onToggle, 
  label,
  description,
  id,
  className = "",
  disabled = false
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        {label && (
          <label htmlFor={id} className="text-sm text-slate-300">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          name={id}
          id={id} 
          checked={isOn}
          onChange={onToggle}
          disabled={disabled}
          className="sr-only"
        />
        <label 
          htmlFor={id} 
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${disabled ? 'opacity-50' : ''}`}
        >
          <span 
            className={`block w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform ${
              isOn ? 'translate-x-4 bg-blue-500' : 'translate-x-0 bg-slate-400'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          />
          <span className="absolute inset-0 bg-slate-700 rounded-full -z-10"></span>
        </label>
      </div>
    </div>
  );
};

// Icon components needed for form components
const SearchIcon = ({ size, className }) => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const XIcon = ({ size, className }) => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);