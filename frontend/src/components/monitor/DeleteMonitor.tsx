import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteMonitorProps {
  id: string;
  name: string;
}

const DeleteMonitor: React.FC<DeleteMonitorProps> = ({ id, name }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  const handleDelete = () => {
    if (confirmText !== name) {
      return;
    }
    
    setIsDeleting(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setIsDeleting(false);
      navigate("/dashboard");
    }, 1500);
  };
  
  const isConfirmEnabled = confirmText === name;
  
  return (
    <Card className="bg-gray-800/40 border-gray-700 animate-slide-up [animation-delay:400ms]">
      <CardHeader>
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-lg text-red-400">Delete Monitor</CardTitle>
        </div>
        <CardDescription>
          This action cannot be undone. This will permanently delete the monitor 
          and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Confirm deletion</h4>
                <p className="text-sm text-gray-300 mb-3">
                  To confirm, type <span className="font-mono bg-gray-700 px-1 py-0.5 rounded text-xs">{name}</span> in the field below.
                </p>
                
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type monitor name to confirm"
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-700 pt-4 flex justify-end">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={!isConfirmEnabled || isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
        >
          {isDeleting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Monitor
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeleteMonitor;
