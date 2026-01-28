import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Glass Container
interface GlassProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'high';
}

export const GlassCard: React.FC<GlassProps> = ({ children, className = '', intensity = 'high', ...props }) => {
  const baseStyle = "rounded-xl shadow-lg backdrop-blur-md transition-all duration-300";
  
  // Light Mode: White/Cream tint with Dark Green border
  // Dark Mode: Dark Green tint with White/Gold border
  const bgStyle = intensity === 'high' 
    ? "bg-white/80 border border-darkveil-900/10 dark:bg-darkveil-900/80 dark:border-white/5" 
    : "bg-white/40 border border-darkveil-900/5 dark:bg-darkveil-900/40 dark:border-white/5";

  return (
    <motion.div 
      className={`${baseStyle} ${bgStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Buttons
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const variants = {
    // Primary: Consistent Gold across themes for brand identity
    primary: "bg-gradient-to-r from-gold-600 to-gold-400 text-darkveil-950 font-bold hover:brightness-110 shadow-gold-900/20 shadow-md border border-gold-300/20",
    
    // Secondary: Dark Green on Light, Lighter Green on Dark
    secondary: "bg-darkveil-100 text-darkveil-900 hover:bg-darkveil-200 border border-darkveil-900/10 dark:bg-darkveil-800 dark:text-gold-200 dark:hover:bg-darkveil-700 dark:border-gold-500/10",
    
    // Ghost: Adaptable Text
    ghost: "text-gray-600 hover:text-gold-600 hover:bg-gold-500/5 dark:text-gray-400 dark:hover:text-gold-300"
  };

  return (
    <button 
      className={`
        relative px-6 py-3 rounded-lg font-medium tracking-wide
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 transition-all duration-200
        flex items-center justify-center gap-2
        ${variants[variant]} ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-darkveil-900/30 border-t-darkveil-900 rounded-full animate-spin dark:border-white/30 dark:border-t-white" />
      ) : children}
    </button>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-darkveil-800 dark:text-gold-300/70 mb-1 ml-1 uppercase tracking-wider transition-colors">{label}</label>}
      <input 
        className={`
          w-full rounded-lg px-4 py-3
          bg-white/60 border border-darkveil-200 text-darkveil-900 placeholder-darkveil-400
          focus:outline-none focus:border-gold-500/50 focus:bg-white
          
          dark:bg-darkveil-900/50 dark:border-darkveil-700 dark:text-gold-100 dark:placeholder-gray-600
          dark:focus:bg-darkveil-900

          transition-colors duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

// Section Header
export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-serif font-bold text-darkveil-900 dark:text-gold-200 tracking-tight transition-colors">{title}</h2>
    {subtitle && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors">{subtitle}</p>}
  </div>
);