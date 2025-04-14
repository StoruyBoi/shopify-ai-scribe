
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ImageUploader } from "@/components/shopify/ImageUploader";
import { SectionTypeSelector } from "@/components/shopify/SectionTypeSelector";
import { RequirementsForm } from "@/components/shopify/RequirementsForm";
import { CodePreview } from "@/components/shopify/CodePreview";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const Index = () => {
  const [image, setImage] = useState<File | null>(null);
  const [sectionType, setSectionType] = useState("hero");
  const [requirements, setRequirements] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const { credits, setCredits } = useAppContext();
  
  const handleImageUpload = (file: File) => {
    setImage(file);
    toast({
      title: "Image uploaded",
      description: "Your reference image has been uploaded successfully.",
    });
  };
  
  const generateCode = () => {
    if (credits <= 0) {
      toast({
        title: "No credits remaining",
        description: "Upgrade your plan to get more credits.",
        variant: "destructive",
      });
      return;
    }
    
    if (!image) {
      toast({
        title: "Missing image",
        description: "Please upload a reference image first.",
        variant: "destructive",
      });
      return;
    }
    
    if (requirements.trim().length < 10) {
      toast({
        title: "Requirements too short",
        description: "Please provide more detailed requirements.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock generated code
      const mockCode = `{% section 'section_${sectionType}' %}
      
{% schema %}
{
  "name": "${sectionType} Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Your heading here"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>Your description here</p>"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image"
    }
  ],
  "presets": [
    {
      "name": "${sectionType} Section",
      "category": "Custom"
    }
  ]
}
{% endschema %}`;
      
      setGeneratedCode(mockCode);
      setCredits(credits - 1);
      setIsGenerating(false);
      
      toast({
        title: "Code generated",
        description: "Your Shopify section code has been generated successfully.",
      });
    }, 3000);
  };
  
  return (
    <Layout>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} />
          <SectionTypeSelector
            selectedType={sectionType}
            onTypeChange={setSectionType}
          />
          <RequirementsForm
            requirements={requirements}
            onRequirementsChange={setRequirements}
            onGenerate={generateCode}
            isGenerating={isGenerating}
            availableCredits={credits}
          />
        </div>
        <div className="h-full">
          <CodePreview code={generatedCode} isGenerating={isGenerating} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
