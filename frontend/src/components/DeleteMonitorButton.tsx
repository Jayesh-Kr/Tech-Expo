
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteMonitorButtonProps {
  monitorId: string;
  monitorName: string;
  onDelete: (id: string) => void;
  className?: string;
}

const DeleteMonitorButton = ({
  monitorId,
  monitorName,
  onDelete,
  className,
}: DeleteMonitorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    try {
      // Call the delete function passed from parent
      onDelete(monitorId);
      toast.success(`"${monitorName}" has been deleted.`);
    } catch (error) {
      toast.error("Failed to delete monitor.");
      console.error("Error deleting monitor:", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`transition-all duration-300 ${className}`}
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Monitor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{monitorName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMonitorButton;
