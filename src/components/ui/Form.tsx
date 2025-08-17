import React from 'react';
import { Search, X } from 'lucide-react';

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
}: {
  label?: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  options?: { value: string; label: string }[];
  rows?: number;
  helpText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
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
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  columns?: 1 | 2 | 3;
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
 * FilterSelect - A reusable filter select component
 * Used for dropdown filters across dashboard pages
 */
export const FilterSelect = ({ 
  value, 
  onChange, 
  options, 
  label,
  className = "" 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  label?: string;
  className?: string;
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
}: {
  isOn: boolean;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  description?: string;
  id: string;
  className?: string;
  disabled?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onToggle(e);
  };
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {label && (
          <label htmlFor={id} className="text-sm text-slate-300 cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <label 
        htmlFor={id}
        className={`relative inline-block w-10 h-6 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input 
          type="checkbox" 
          name={id}
          id={id} 
          checked={isOn}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          absolute inset-0 
          rounded-full 
          transition-colors duration-200 ease-in-out
          ${isOn ? 'bg-blue-500' : 'bg-slate-700'}
        `}></div>
        <div className={`
          absolute w-5 h-5 
          bg-white rounded-full 
          shadow-md
          top-0.5 left-0.5
          transition-transform duration-200 ease-in-out
          ${isOn ? 'transform translate-x-4' : ''}
        `}></div>
      </label>
    </div>
  );
};

export default {
  FormField,
  FormGroup,
  FilterSelect,
  ToggleSwitch
};