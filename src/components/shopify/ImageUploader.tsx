
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  preview: string | null;
  onRemoveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  preview,
  onRemoveImage
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!fileTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageUpload(file, previewUrl);
  }, [onImageUpload, toast]);

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-bold">1</span>
          </div>
          <h3 className="text-lg font-semibold">Reference Image</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an image of the website section you want to recreate
        </p>
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Reference design" 
              className="w-full h-auto rounded-lg border border-border mb-2" 
            />
            
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={onRemoveImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              This image will be used as a reference for generating your Shopify code
            </p>
          </div>
        ) : (
          <div 
            className={`relative border-2 border-dashed rounded-lg transition-all overflow-hidden
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50 bg-card/40'
              }
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Upload image"
            />
            <div className="flex flex-col items-center justify-center text-center p-10 space-y-4">
              <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-muted'} transition-colors`}>
                {isDragging ? (
                  <ImageIcon className="h-8 w-8 text-primary animate-pulse" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or <span className="text-primary cursor-pointer">browse files</span>
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-muted/80">JPEG</span>
                <span className="px-2 py-1 rounded-full bg-muted/80">PNG</span>
                <span className="px-2 py-1 rounded-full bg-muted/80">WebP</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
