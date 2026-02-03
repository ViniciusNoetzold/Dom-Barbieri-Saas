import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className = "", onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`flex p-1 bg-darkveil-900/5 dark:bg-white/5 rounded-full relative ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className = "" }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`
        relative flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full z-10
        ${isActive ? "text-darkveil-950 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-darkveil-900 dark:hover:text-gold-200"}
        ${className}
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-bubble"
          className="absolute inset-0 bg-gold-500 rounded-full -z-10 shadow-md shadow-gold-900/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className = "" }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`mt-6 focus-visible:outline-none ${className}`}
    >
      {children}
    </motion.div>
  );
};
