
import React from 'react';
import { Check } from 'lucide-react';
import { ImageOptions } from '@/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface SectionTypeSelectorProps {
  selectedOptions: ImageOptions;
  onOptionsChange: (options: ImageOptions) => void;
  isVisible: boolean;
}

const sectionTypes: Array<{
  value: ImageOptions['purpose'];
  title: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'product',
    title: 'Product Section',
    description: 'Product details with images',
    icon: '🛍️'
  },
  {
    value: 'slider',
    title: 'Slideshow',
    description: 'Images in carousel',
    icon: '🔄'
  },
  {
    value: 'banner',
    title: 'Banner',
    description: 'Hero with overlay text',
    icon: '🏷️'
  },
  {
    value: 'collection',
    title: 'Collection Grid',
    description: 'Product collections',
    icon: '📦'
  },
  {
    value: 'announcement',
    title: 'Announcement',
    description: 'Top notifications',
    icon: '📢'
  },
  {
    value: 'footer',
    title: 'Footer',
    description: 'Page footer with links',
    icon: '🔚'
  },
  {
    value: 'header',
    title: 'Header',
    description: 'Navigation & logo',
    icon: '🔝'
  },
  {
    value: 'image-with-text',
    title: 'Image with Text',
    description: 'Side by side layout',
    icon: '📝'
  },
  {
    value: 'multicolumn',
    title: 'Multi Column',
    description: 'Features or benefits',
    icon: '🏛️'
  },
  {
    value: 'custom',
    title: 'Custom Section',
    description: 'Your own section type',
    icon: '✨'
  }
];

const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({ 
  selectedOptions, 
  onOptionsChange,
  isVisible
}) => {
  if (!isVisible) return null;
  
  const handlePurposeSelect = (purpose: ImageOptions['purpose']) => {
    onOptionsChange({ 
      ...selectedOptions, 
      purpose 
    });
  };
  
  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...selectedOptions,
      customType: e.target.value
    });
  };

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-bold">2</span>
          </div>
          <h3 className="text-lg font-semibold">Section Type</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select the type of Shopify section you want to create</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sectionTypes.map((option) => (
            <div
              key={option.value}
              onClick={() => handlePurposeSelect(option.value)}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative
                ${selectedOptions.purpose === option.value 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30' 
                  : 'border-border bg-card/50 hover:border-muted-foreground/30 hover:bg-muted/10'
                }
              `}
            >
              {selectedOptions.purpose === option.value && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </span>
              )}
              <div className="text-3xl mb-2 opacity-90">{option.icon}</div>
              <h4 className="font-medium text-sm">{option.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{option.description}</p>
            </div>
          ))}
        </div>
        
        {/* Custom Section Type Input */}
        {selectedOptions.purpose === 'custom' && (
          <div className="mt-4">
            <label htmlFor="customType" className="block text-sm font-medium mb-1">
              Custom Section Type Name
            </label>
            <Input
              id="customType"
              type="text"
              placeholder="Enter custom section type name"
              value={selectedOptions.customType || ''}
              onChange={handleCustomTypeChange}
              className="w-full max-w-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionTypeSelector;
