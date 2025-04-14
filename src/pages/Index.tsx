
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import ImageUploader from "@/components/shopify/ImageUploader";
import SectionTypeSelector from "@/components/shopify/SectionTypeSelector";
import RequirementsForm from "@/components/shopify/RequirementsForm";
import PreviewArea from "@/components/shopify/PreviewArea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { GeneratedCode, ImageOptions } from "@/types";
import { generateShopifyCode } from "@/services/claude";

const Index = () => {
  // State
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sectionOptions, setSectionOptions] = useState<ImageOptions>({ purpose: "hero" });
  const [requirements, setRequirements] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { credits, useCredit } = useAppContext();
  
  // Handle image upload
  const handleImageUpload = (file: File, previewUrl: string) => {
    setImage(file);
    setImagePreview(previewUrl);
    toast({
      title: "Image uploaded",
      description: "Your reference image has been uploaded successfully.",
    });
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  // Generate Shopify code
  const generateCode = async () => {
    // Validation
    if (credits.current <= 0) {
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
    
    try {
      // Use a credit
      useCredit();
      
      // Generate image description
      const imageDescription = `The user uploaded an image of a ${sectionOptions.purpose} section design.`;
      
      // Get section type name (with custom handling)
      const sectionType = sectionOptions.purpose === 'custom' 
        ? sectionOptions.customType || 'custom section' 
        : sectionOptions.purpose;
      
      // Generate code
      const code = await generateShopifyCode(
        sectionType,
        requirements,
        imageDescription
      );
      
      setGeneratedCode(code);
      
      toast({
        title: "Code generated",
        description: "Your Shopify section code has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error generating code",
        description: "There was an error generating your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <div className="max-w-4xl mx-auto text-center pt-4 pb-8">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
            AI-Powered Shopify Code Generator
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Transform Images into Shopify Liquid Code
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload an image of a website section and let our AI generate Shopify Liquid code to recreate it.
            Choose from product listings, sliders, banners and more.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="space-y-6">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            preview={imagePreview}
            onRemoveImage={handleRemoveImage}
          />
          
          <SectionTypeSelector
            selectedOptions={sectionOptions}
            onOptionsChange={setSectionOptions}
          />
          
          <RequirementsForm
            requirements={requirements}
            onRequirementsChange={setRequirements}
            onGenerate={generateCode}
            isGenerating={isGenerating}
            availableCredits={credits.current}
            selectedOptions={sectionOptions}
            imageUploaded={!!image}
          />
        </div>
        
        <div>
          <PreviewArea 
            previewUrl={imagePreview}
            isProcessing={isGenerating}
            generatedCode={generatedCode}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
