import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { TimeWheel } from "./TimeWheel";

interface ProgramSchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: { name: string } | null;
  time: string;
  onTimeChange: (t: string) => void;
  onSchedule: () => void;
}

export function ProgramSchedulerDialog(props: ProgramSchedulerDialogProps) {
  const { open, onOpenChange, program, time, onTimeChange, onSchedule } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#FFEBCD] border-[#8B7355] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723]">Schedule Program</DialogTitle>
          <DialogDescription className="text-[#5C4033]/80">
            {program ? program.name : "Select a program"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <TimeWheel value={time} onChange={onTimeChange} />
          <Button
            className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
            onClick={onSchedule}
          >
            Schedule Program
          </Button>
          <Button
            variant="ghost"
            className="w-full text-[#5C4033] hover:bg-white/40"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


