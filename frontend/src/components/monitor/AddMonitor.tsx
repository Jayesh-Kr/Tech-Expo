import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMonitor: React.FC<AddMonitorProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    checkFrequency: "60",
    type: "http",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Monitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Monitor Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Monitor Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Monitor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP(S)</SelectItem>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="dns">DNS</SelectItem>
                    <SelectItem value="ping">Ping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkFrequency">Check Frequency</Label>
                <Select
                  value={formData.checkFrequency}
                  onValueChange={(value) => handleSelectChange("checkFrequency", value)}
                >
                  <SelectTrigger id="checkFrequency">
                    <SelectValue placeholder="Check Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Monitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMonitor;
