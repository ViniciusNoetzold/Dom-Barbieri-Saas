import React from 'react';
import { ASSETS } from '../constants';
import SplitText from './SplitText';

interface GlobalHeroProps {
  title: string;
  subtitle?: string;
  heightClass?: string;
  backgroundImage?: string;
  titleColor?: string; // Hex color for specific contrast control
  overlayGradient?: string;
}

export const GlobalHero: React.FC<GlobalHeroProps> = ({ 
  title, 
  subtitle, 
  heightClass = "h-[45vh]", // Increased height slightly for more breathing room
  backgroundImage = ASSETS.HERO_BG,
  titleColor = "#D4AF37", // Default to Gold/Amber as requested
  // Adjusted mask to ensure smooth fade into the dark app background
  overlayGradient = 'linear-gradient(to bottom, black 50%, transparent 100%)'
}) => {
  return (
    <div className={`relative w-full ${heightClass} overflow-hidden flex items-end group transition-all duration-500`}>
      {/* Background Image with Gradient Mask 
          The mask-image property makes the image fade to transparent at the bottom,
          blending perfectly with the app's solid background color.
      */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[3s] hover:scale-105"
        style={{ 
          backgroundImage: `url("${backgroundImage}")`,
          maskImage: overlayGradient,
          WebkitMaskImage: overlayGradient
        }}
      />
      
      {/* Content with Increased Spacing (Respiro) */}
      <div className="relative z-20 px-8 pb-14 w-full">
        <div className="mb-4 space-y-3">
            {/* SplitText wrapper */}
            <div style={{ color: titleColor }} className="drop-shadow-sm">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-[1.1]">
                    <SplitText
                        text={title}
                        className="block"
                        delay={20}
                        duration={1.2}
                    />
                </h1>
            </div>
            {subtitle && (
                <p 
                  className="text-lg md:text-xl font-serif italic opacity-90 tracking-wide"
                  style={{ color: titleColor }} 
                >
                    {subtitle}
                </p>
            )}
        </div>
        
        {/* Decorative Line */}
        <div 
            className="w-20 h-1.5 mt-6 mb-2 rounded-full opacity-80" 
            style={{ backgroundColor: titleColor }}
        />
      </div>
    </div>
  );
};