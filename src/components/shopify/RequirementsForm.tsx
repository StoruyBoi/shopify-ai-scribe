
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface RequirementsFormProps {
  requirements: string;
  onRequirementsChange: (requirements: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  availableCredits: number;
}

export function RequirementsForm({
  requirements,
  onRequirementsChange,
  onGenerate,
  isGenerating,
  availableCredits,
}: RequirementsFormProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Section Requirements</h3>
          <div className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
            {availableCredits}/3 credits remaining
          </div>
        </div>
        
        <Textarea
          value={requirements}
          onChange={(e) => onRequirementsChange(e.target.value)}
          placeholder="Describe your section requirements in detail. For example: 'A hero banner with a large image, heading, subheading, and a call-to-action button. The text should be on the left and image on the right. Mobile layout should stack with text on top.'"
          className="min-h-[150px] mb-4"
        />
        
        <Button
          onClick={onGenerate}
          disabled={isGenerating || requirements.trim().length < 10 || availableCredits <= 0}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Wand2 size={16} className="mr-2" />
          {isGenerating ? "Generating..." : "Generate Section Code"}
        </Button>
        
        {availableCredits <= 0 && (
          <p className="text-xs text-destructive mt-2 text-center">
            You've used all your daily credits. Upgrade your plan for more.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
