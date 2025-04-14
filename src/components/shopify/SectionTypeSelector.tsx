
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SECTION_TYPES = [
  { value: "hero", label: "Hero Banner" },
  { value: "product-list", label: "Product List" },
  { value: "image-with-text", label: "Image with Text" },
  { value: "testimonials", label: "Testimonials" },
  { value: "features", label: "Features Grid" },
  { value: "collection", label: "Collection Slider" },
  { value: "faq", label: "FAQ Accordion" },
  { value: "newsletter", label: "Newsletter Signup" },
  { value: "video", label: "Video Section" },
  { value: "custom", label: "Custom Section" },
];

interface SectionTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function SectionTypeSelector({
  selectedType,
  onTypeChange,
}: SectionTypeSelectorProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Section Type</h3>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select section type" />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center">
                  <span>{type.label}</span>
                  {type.value === selectedType && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
