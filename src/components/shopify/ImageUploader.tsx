
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps { 
  onImageUpload: (file: File, previewUrl: string) => void;
  preview?: string | null;
  onRemoveImage?: () => void;
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

  const removeImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  return (
    <div className="glass-card">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">Upload Reference Image</h3>
        
        {!preview ? (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-md p-8
              flex flex-col items-center justify-center text-center
              transition-colors duration-200
              ${isDragging ? 'border-secondary bg-secondary/5' : 'border-border'}
            `}
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
                onChange={handleFileInput}
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
      </div>
    </div>
  );
};

export default ImageUploader;
