
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import ImageUploader from "@/components/shopify/ImageUploader";
import SectionTypeSelector from "@/components/shopify/SectionTypeSelector";
import RequirementsForm from "@/components/shopify/RequirementsForm";
import PreviewArea from "@/components/shopify/PreviewArea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { GeneratedCode, ImageOptions, ChatHistoryItem } from "@/types";
import { generateShopifyCode } from "@/services/claude";
import { useSearchParams } from 'react-router-dom';
import { createNewChat, updateChat, getAllChats } from "@/services/chatHistoryService";

const Index = () => {
  // URL params
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');
  
  // State
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sectionOptions, setSectionOptions] = useState<ImageOptions>({ purpose: "product" });
  const [requirements, setRequirements] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { credits, useCredit } = useAppContext();
  
  // Load chat data if chatId is provided
  useEffect(() => {
    if (chatId) {
      const chats = getAllChats();
      const selectedChat = chats.find(chat => chat.id === chatId);
      
      if (selectedChat) {
        setCurrentChatId(chatId);
        // If the chat has saved data, restore it
        if (selectedChat.imageUrl) {
          setImagePreview(selectedChat.imageUrl);
          setCurrentStep(2); // Move to section type selection
        }
        
        if (selectedChat.sectionType) {
          const sectionType = selectedChat.sectionType as ImageOptions['purpose'];
          setSectionOptions({ 
            purpose: sectionType, 
            customType: sectionType === 'custom' ? selectedChat.sectionType : undefined 
          });
        }
      }
    }
  }, [chatId]);
  
  // Handle image upload
  const handleImageUpload = (file: File, previewUrl: string) => {
    setImage(file);
    setImagePreview(previewUrl);
    setCurrentStep(2); // Move to section type selection
    
    // Create new chat or update existing one
    let chatToUpdate = currentChatId;
    if (!chatToUpdate) {
      const newChat = createNewChat();
      chatToUpdate = newChat.id;
      setCurrentChatId(newChat.id);
    }
    
    // Update chat with image
    updateChat(chatToUpdate, {
      imageUrl: previewUrl
    });
    
    toast({
      title: "Image uploaded",
      description: "Your reference image has been uploaded successfully.",
    });
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setCurrentStep(1);
    
    if (currentChatId) {
      updateChat(currentChatId, {
        imageUrl: undefined
      });
    }
  };
  
  // Update section options
  const handleSectionOptionsChange = (options: ImageOptions) => {
    setSectionOptions(options);
    setCurrentStep(3); // Move to requirements step
    
    // Update chat with section type
    if (currentChatId) {
      updateChat(currentChatId, {
        sectionType: options.purpose === 'custom' && options.customType 
          ? options.customType 
          : options.purpose
      });
    }
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
      
      // Update chat with title based on section type
      if (currentChatId) {
        updateChat(currentChatId, {
          title: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} section`
        });
      }
      
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
      <div className="w-full py-6">
        <div className="max-w-4xl mx-auto text-center px-4 pb-8 pt-4">
          <div className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
            AI-Powered Shopify Code Generator
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-app-purple to-app-blue">
            Transform Images into Shopify Liquid Code
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload an image of a website section and let our AI generate Shopify Liquid code to recreate it.
            Choose from product listings, sliders, banners and more.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="space-y-6">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                preview={imagePreview}
                onRemoveImage={handleRemoveImage}
              />
              
              <SectionTypeSelector
                selectedOptions={sectionOptions}
                onOptionsChange={handleSectionOptionsChange}
                isVisible={currentStep >= 2}
              />
              
              <RequirementsForm
                requirements={requirements}
                onRequirementsChange={setRequirements}
                onGenerate={generateCode}
                isGenerating={isGenerating}
                availableCredits={credits.current}
                selectedOptions={sectionOptions}
                imageUploaded={!!image}
                isVisible={currentStep >= 3}
              />
            </div>
            
            <div>
              <PreviewArea 
                previewUrl={imagePreview}
                isProcessing={isGenerating}
                generatedCode={generatedCode}
                currentStep={currentStep}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
