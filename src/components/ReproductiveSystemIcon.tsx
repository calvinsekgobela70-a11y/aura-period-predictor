import React from 'react';

export function ReproductiveSystemIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Vagina / Cervix area */}
      <path d="M50 85 C 45 75, 45 65, 50 55 C 55 65, 55 75, 50 85 Z" fill={color} fillOpacity="0.2"/>
      
      {/* Uterus body */}
      <path d="M50 55 C 20 45, 30 15, 50 20 C 70 15, 80 45, 50 55 Z" fill={color} fillOpacity="0.4"/>
      
      {/* Fallopian Tubes */}
      <path d="M35 25 C 20 20, 15 35, 20 45" />
      <path d="M65 25 C 80 20, 85 35, 80 45" />
      
      {/* Ovaries */}
      <circle cx="20" cy="45" r="5" fill={color} fillOpacity="0.6" />
      <circle cx="80" cy="45" r="5" fill={color} fillOpacity="0.6" />
    </svg>
  );
}
