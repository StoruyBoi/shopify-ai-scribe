
import React from "react";
import { Check } from "lucide-react";
import { ImageOptions } from "@/types";

const options: Array<{
  value: ImageOptions['purpose'];
  title: string;
  description: string;
  icon: string;
}> = [
  {
    value: "product",
    title: "Product Section",
    description: "Product details with images and info",
    icon: "🛍️"
  },
  {
    value: "slider",
    title: "Slideshow",
    description: "Multiple images in a carousel",
    icon: "🔄"
  },
  {
    value: "banner",
    title: "Image Banner",
    description: "Large image with overlay text",
    icon: "🏷️"
  },
  {
    value: "collection",
    title: "Collection List",
    description: "Grid of product collections",
    icon: "📦"
  },
  {
    value: "announcement",
    title: "Announcement Bar",
    description: "Top of page announcements",
    icon: "📢"
  },
  {
    value: "header",
    title: "Header",
    description: "Navigation menu and logo",
    icon: "🔝"
  },
  {
    value: "footer",
    title: "Footer",
    description: "Links and info at page bottom",
    icon: "🔚"
  },
  {
    value: "image-with-text",
    title: "Image with Text",
    description: "Image alongside text content",
    icon: "📝"
  },
  {
    value: "multicolumn",
    title: "Multi-column",
    description: "Content in multiple columns",
    icon: "🏛️"
  },
  {
    value: "custom",
    title: "Custom Section",
    description: "Define your own section type",
    icon: "✨"
  }
];

interface SectionTypeSelectorProps {
  selectedOptions: ImageOptions;
  onOptionsChange: (options: ImageOptions) => void;
}

const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({ 
  selectedOptions, 
  onOptionsChange 
}) => {
  const handlePurposeSelect = (purpose: ImageOptions['purpose']) => {
    onOptionsChange({ 
      ...selectedOptions, 
      purpose 
    });
  };
  
  return (
    <div className="glass-card">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Shopify Section Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handlePurposeSelect(option.value)}
              className={`p-3 rounded-lg border transition-all cursor-pointer
                ${selectedOptions.purpose === option.value 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card/50 hover:border-muted-foreground/50'
                }
              `}
            >
              <div className="flex items-start gap-2">
                <div className="text-xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{option.title}</h4>
                    {selectedOptions.purpose === option.value && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionTypeSelector;
