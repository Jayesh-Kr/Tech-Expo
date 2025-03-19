import React from "react";

interface GlowEffectProps {
  color?: "green" | "blue" | "red" | "yellow" | "purple";
  opacity?: number;
  size?: "sm" | "md" | "lg";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  className?: string;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  color = "blue",
  opacity = 0.15,
  size = "md",
  position = "top-right",
  className = "",
}) => {
  const getColorClass = () => {
    switch (color) {
      case "green": return "bg-green-500";
      case "red": return "bg-rose-500";
      case "yellow": return "bg-amber-500";
      case "purple": return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm": return "w-32 h-32";
      case "lg": return "w-96 h-96";
      default: return "w-64 h-64";
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case "top-left": return "-top-16 -left-16";
      case "bottom-left": return "-bottom-16 -left-16";
      case "bottom-right": return "-bottom-16 -right-16";
      case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default: return "-top-16 -right-16";
    }
  };
  
  return (
    <div 
      className={`absolute ${getPositionClass()} ${getSizeClass()} ${getColorClass()} rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
};

export default GlowEffect;
