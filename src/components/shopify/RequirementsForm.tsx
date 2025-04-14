
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Info, Server, ArrowRight } from "lucide-react";
import { ImageOptions } from "@/types";

interface RequirementsFormProps {
  requirements: string;
  onRequirementsChange: (requirements: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  availableCredits: number;
  selectedOptions: ImageOptions;
  imageUploaded: boolean;
}

export function RequirementsForm({
  requirements,
  onRequirementsChange,
  onGenerate,
  isGenerating,
  availableCredits,
  selectedOptions,
  imageUploaded
}: RequirementsFormProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Section Requirements</h3>
          <div className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
            {availableCredits}/3 credits remaining
          </div>
        </div>
        
        <Textarea
          value={requirements}
          onChange={(e) => onRequirementsChange(e.target.value)}
          placeholder={`Describe your ${selectedOptions.purpose} section requirements in detail. For example: 'A ${selectedOptions.purpose} with a large image, heading, subheading, and a call-to-action button. The text should be on the left and image on the right. Mobile layout should stack with text on top.'`}
          className="min-h-[150px] mb-4"
        />
        
        <div className="mt-3 p-3 bg-blue-50/30 border border-blue-200 rounded-md flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-blue-700">
            <p className="font-medium mb-1">Demo Mode Active</p>
            <p>Due to CORS restrictions, this demo uses mock responses instead of actual Claude API calls.</p>
          </div>
        </div>

        <div className="mt-3 p-4 bg-green-50/30 border border-green-200 rounded-md">
          <h4 className="text-sm font-medium text-green-800 flex items-center gap-2 mb-2">
            <Server className="h-4 w-4" />
            Next.js Implementation Guide
          </h4>
          <p className="text-xs text-green-700 mb-2">
            To use the actual Claude API, create a Next.js API route that acts as a proxy:
          </p>
          <div className="bg-white/60 rounded text-xs p-3 font-mono text-green-900 space-y-1 overflow-x-auto">
            <p className="whitespace-nowrap">
              <span className="text-green-600">// pages/api/generate.js</span>
            </p>
            <p className="whitespace-nowrap">export default async function handler(req, res) {'{'}</p>
            <p className="whitespace-nowrap pl-2">if (req.method !== 'POST') return res.status(405).end();</p>
            <p className="whitespace-nowrap pl-2">const {'{ sectionType, requirements, imageBase64 }'} = req.body;</p>
            <p className="whitespace-nowrap pl-2">const response = await fetch('https://api.anthropic.com/v1/messages', {'{'}</p>
            <p className="whitespace-nowrap pl-4">method: 'POST',</p>
            <p className="whitespace-nowrap pl-4">headers: {'{'}</p>
            <p className="whitespace-nowrap pl-6">'x-api-key': process.env.CLAUDE_API_KEY,</p>
            <p className="whitespace-nowrap pl-6">'anthropic-version': '2023-06-01',</p>
            <p className="whitespace-nowrap pl-6">'content-type': 'application/json'</p>
            <p className="whitespace-nowrap pl-4">{'}'},</p>
            <p className="whitespace-nowrap pl-4">body: JSON.stringify({/* Claude request body */})</p>
            <p className="whitespace-nowrap pl-2">{'}'});</p>
            <p className="whitespace-nowrap pl-2">const data = await response.json();</p>
            <p className="whitespace-nowrap pl-2">return res.status(200).json(data);</p>
            <p className="whitespace-nowrap">{'}'}</p>
          </div>
          <div className="mt-2 flex items-center text-xs text-green-700">
            <ArrowRight className="h-3 w-3 mr-1" />
            <span>Then update the client code to call this API route instead of directly calling Claude.</span>
          </div>
        </div>
        
        <Button
          onClick={onGenerate}
          disabled={isGenerating || requirements.trim().length < 10 || availableCredits <= 0 || !imageUploaded}
          className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Wand2 size={16} className="mr-2" />
          {isGenerating ? "Generating..." : "Generate Section Code"}
        </Button>
        
        {!imageUploaded && (
          <p className="text-xs text-destructive mt-2 text-center">
            Please upload an image first
          </p>
        )}
        
        {requirements.trim().length < 10 && (
          <p className="text-xs text-destructive mt-2 text-center">
            Please provide more detailed requirements
          </p>
        )}
        
        {availableCredits <= 0 && (
          <p className="text-xs text-destructive mt-2 text-center">
            You've used all your daily credits. Upgrade your plan for more.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default RequirementsForm;
