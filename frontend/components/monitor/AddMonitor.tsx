import React from "react";

interface AddMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMonitor: React.FC<AddMonitorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Monitor</h2>
        <p className="mb-4">This is a placeholder for the Add Monitor dialog.</p>
        <button 
          onClick={onClose}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddMonitor;
