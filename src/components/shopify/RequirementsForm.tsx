
import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; 
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageOptions } from '@/types';

interface RequirementsFormProps {
  requirements: string;
  onRequirementsChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  availableCredits: number;
  selectedOptions: ImageOptions;
  imageUploaded: boolean;
  isVisible: boolean;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  requirements,
  onRequirementsChange,
  onGenerate,
  isGenerating,
  availableCredits,
  selectedOptions,
  imageUploaded,
  isVisible
}) => {
  if (!isVisible) return null;

  // Get display name for section type
  const getSectionDisplayName = () => {
    if (selectedOptions.purpose === 'custom' && selectedOptions.customType) {
      return selectedOptions.customType;
    }
    
    return selectedOptions.purpose
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };
  
  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold">Section Requirements</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Add specific requirements for your {getSectionDisplayName()} section
        </p>

        <div className="space-y-4">
          <Textarea
            placeholder={`Describe how you want your ${getSectionDisplayName()} section to look and function. Be specific about layout, features, colors, animations, etc.`}
            className="min-h-32 resize-y"
            value={requirements}
            onChange={(e) => onRequirementsChange(e.target.value)}
          />
          
          {availableCredits <= 3 && (
            <Alert variant="warning" className="text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limited credits remaining</AlertTitle>
              <AlertDescription>
                You have {availableCredits} {availableCredits === 1 ? 'credit' : 'credits'} left. Consider upgrading your plan for unlimited code generations.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {availableCredits} {availableCredits === 1 ? 'credit' : 'credits'} remaining
            </div>
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !imageUploaded || requirements.length < 10}
              className="gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Shopify Code</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsForm;
