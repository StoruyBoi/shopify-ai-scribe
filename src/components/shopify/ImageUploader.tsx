
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  onImageUpload: (image: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setPreview(null);
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Upload Reference Image</h3>
        
        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-md p-8",
              "flex flex-col items-center justify-center text-center",
              "transition-colors duration-200",
              isDragging ? "border-secondary bg-secondary/5" : "border-border"
            )}
          >
            <ImageIcon size={40} className="text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop your image here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: PNG, JPG, WEBP (max 5MB)
            </p>
            <label htmlFor="image-upload">
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload size={16} className="mr-2" />
                Select Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-auto rounded-md object-contain max-h-64"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
