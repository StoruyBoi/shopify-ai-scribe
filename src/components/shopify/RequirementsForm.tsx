
import React from 'react';
import { Sparkles, Bot, InfoIcon, AlertCircle } from 'lucide-react';
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
}

const DEFAULT_REQUIREMENTS: Record<string, string> = {
  product: "Create a product section with image on the left and product details on the right. Include product title, price, variants selection, quantity picker, and add to cart button.",
  slider: "Create a full-width image slider with 3 slides, navigation arrows, and dot indicators. Add a heading and text overlay on each slide with a call-to-action button.",
  banner: "Design a hero banner with a background image, heading text overlay, subheading, and a call-to-action button. Make it responsive for all devices.",
  collection: "Create a collection grid showing 3 collections per row, with collection images, titles, and view collection buttons. Make it responsive with 2 columns on tablet and 1 column on mobile.",
  announcement: "Create an announcement bar that sticks to the top of the page, with customizable text and link. Include an option to dismiss it.",
  image_with_text: "Create a section with an image on the left and text content on the right. Include heading, paragraph text, and a button. Make it responsive with stacked layout on mobile.",
  default: "Please describe your section requirements in detail. Include information about layout, content, styling preferences, responsive behavior, and any special functionality."
};

const RequirementsForm: React.FC<RequirementsFormProps> = ({
  requirements,
  onRequirementsChange,
  onGenerate,
  isGenerating,
  availableCredits,
  selectedOptions,
  imageUploaded
}) => {
  // Get appropriate placeholder based on section type
  const getPlaceholderText = () => {
    const purpose = selectedOptions.purpose.replace('-', '_');
    return DEFAULT_REQUIREMENTS[purpose] || DEFAULT_REQUIREMENTS.default;
  };
  
  // Handle loading sample requirements
  const loadSampleRequirements = () => {
    onRequirementsChange(getPlaceholderText());
  };
  
  // Determine if the generate button should be disabled
  const isGenerateDisabled = isGenerating || !requirements.trim() || !imageUploaded || availableCredits <= 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 text-xs"
            onClick={loadSampleRequirements}
          >
            Load Sample
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Describe how your Shopify section should look and function
        </p>
        
        <Textarea
          value={requirements}
          onChange={(e) => onRequirementsChange(e.target.value)}
          placeholder={getPlaceholderText()}
          className="min-h-[180px] mb-4 font-mono text-sm"
        />
        
        {!imageUploaded && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing reference image</AlertTitle>
            <AlertDescription>
              Please upload an image before generating code
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Credits: </span>
            <span className={`font-medium ${availableCredits > 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
              {availableCredits} remaining
            </span>
          </div>
          
          <Button
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            className="gap-2 bg-gradient-to-r from-app-purple to-app-blue hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <Bot className="h-4 w-4 animate-bounce" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Code</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsForm;
