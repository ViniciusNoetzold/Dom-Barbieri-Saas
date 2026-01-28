import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Service } from '../types';

interface AnimatedItemProps {
  item: Service;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ item, isSelected, onClick, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.li
      ref={ref}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`
        relative p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300
        backdrop-blur-[12px] border
        ${isSelected 
          ? 'bg-white dark:bg-darkveil-800 border-gold-500 shadow-[0_0_15px_rgba(184,146,48,0.2)] z-10 scale-[1.02]' 
          : 'bg-white/40 dark:bg-white/5 border-darkveil-900/5 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10'}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`font-bold text-lg transition-colors font-serif ${isSelected ? 'text-gold-600 dark:text-gold-200' : 'text-darkveil-900 dark:text-gray-200'}`}>
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>
        <div className="text-right">
           <span className="block text-gold-600 dark:text-gold-400 font-semibold">${item.price}</span>
           <span className="text-xs text-gray-500">{item.durationMinutes} min</span>
        </div>
      </div>
    </motion.li>
  );
};

interface AnimatedListProps {
  items: Service[];
  onSelect: (item: Service) => void;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ items, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        onSelect(items[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onSelect]);

  // Auto-scroll to keep selected item in view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="relative group">
      {/* Scroll Fade Gradients */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-gold-50 dark:from-darkveil-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gold-50 dark:from-darkveil-950 to-transparent z-20 pointer-events-none" />
      
      <ul 
        ref={listRef} 
        className="max-h-[65vh] overflow-y-auto no-scrollbar py-6 px-2 space-y-2 outline-none"
      >
        {items.map((item, idx) => (
          <AnimatedItem 
            key={item.id} 
            item={item} 
            index={idx}
            isSelected={idx === selectedIndex}
            onClick={() => {
              setSelectedIndex(idx);
              onSelect(item);
            }} 
          />
        ))}
      </ul>
      
      <div className="text-center text-xs text-gray-500 mt-2">
        Use Arrow Keys / Tap to select
      </div>
    </div>
  );
};