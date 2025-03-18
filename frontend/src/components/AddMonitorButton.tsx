
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddMonitorButtonProps {
  onClick: () => void;
  className?: string;
}

const AddMonitorButton = ({ onClick, className }: AddMonitorButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className={`transition-all duration-300 flex items-center group ${className}`}
      variant="outline"
    >
      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">New Monitor</span>
    </Button>
  );
};

export default AddMonitorButton;
