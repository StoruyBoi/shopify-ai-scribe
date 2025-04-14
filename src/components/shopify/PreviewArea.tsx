
import React, { useState, useEffect } from 'react';
import { Loader2, Bot, AlertCircle, Terminal, Server, ArrowRight, FileCode, Copy, ExternalLink } from 'lucide-react';
import CodePreview from './CodePreview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GeneratedCode } from '@/types';

interface PreviewAreaProps {
  previewUrl: string | null;
  isProcessing: boolean;
  generatedCode?: GeneratedCode | null;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  previewUrl,
  isProcessing,
  generatedCode
}) => {
  const [displayCode, setDisplayCode] = useState<string>('');
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  
  // Helper to combine code and schema into a single Shopify section
  const combineCodeAndSchema = (code: string, schema: string): string => {
    // Remove HTML tags if present
    const cleanCode = code.replace(/<\/?html>/g, '').trim();
    return `<!-- HTML/Liquid Template for Shopify Section -->\n${cleanCode}\n\n${schema}`;
  };
  
  // Get the combined code for display
  const getCombinedCode = (): string => {
    if (!generatedCode) return '';
    return combineCodeAndSchema(generatedCode.code, generatedCode.shopifyLiquid);
  };
  
  // Animation timers
  useEffect(() => {
    if (isProcessing && !isGeneratingAnimation) {
      setIsGeneratingAnimation(true);
      setDisplayCode('');
      setCurrentLine(0);
    }
    
    if (!isProcessing && generatedCode && isGeneratingAnimation) {
      // Start the animated typing effect when code is ready
      const combinedCode = combineCodeAndSchema(generatedCode.code, generatedCode.shopifyLiquid);
      let codeLines = combinedCode.split('\n');
      let codeCurrent = '';
      let lineIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (lineIndex < codeLines.length) {
          codeCurrent += codeLines[lineIndex] + '\n';
          setDisplayCode(codeCurrent);
          setCurrentLine(lineIndex);
          lineIndex++;
        } else {
          clearInterval(typingInterval);
          setIsGeneratingAnimation(false);
          setDisplayCode(combinedCode);
        }
      }, 30); // Speed of typing animation - faster than before
      
      return () => clearInterval(typingInterval);
    }
  }, [isProcessing, generatedCode, isGeneratingAnimation]);

  if (!previewUrl && !isProcessing && !generatedCode) return null;

  return (
    <div className="space-y-6 rounded-lg overflow-hidden">
      {/* Image Preview */}
      {previewUrl && (
        <Card className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden bg-muted/20 grid place-items-center">
            <img 
              src={previewUrl} 
              alt="Reference image" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardContent className="p-3 text-sm text-muted-foreground">
            Reference image
          </CardContent>
        </Card>
      )}
      
      {/* Loading State */}
      {isProcessing && (
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
              </div>
              <p className="mt-6 font-medium">Generating Shopify section code</p>
              <p className="text-sm text-muted-foreground mt-2">This might take a few seconds</p>
              
              <div className="w-full max-w-md mt-8">
                <div className="space-y-2">
                  <Skeleton className="h-2 w-3/4" />
                  <Skeleton className="h-2 w-5/6" />
                  <Skeleton className="h-2 w-2/3" />
                  <Skeleton className="h-2 w-4/5" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
                
                <div className="mt-6 bg-background/70 rounded-md p-3 border border-dashed border-primary/30 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <p className="text-xs font-mono text-primary">Generating code...</p>
                  </div>
                  <div className="animate-pulse space-y-1 font-mono text-xs">
                    <div className="h-2 bg-muted w-5/6 rounded" />
                    <div className="h-2 bg-muted w-3/4 rounded" />
                    <div className="h-2 bg-muted w-4/5 rounded" />
                    <div className="h-2 bg-muted w-2/3 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Preview */}
      {generatedCode && (
        <div className="space-y-5">
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div className="p-5 border-b">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/20 rounded-full p-2 flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Your Shopify code is ready!</h3>
                    <p className="text-muted-foreground">
                      I've generated Shopify Liquid code based on your requirements.
                      You can copy this code directly into your Shopify theme editor.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert variant="warning" className="m-5 mb-0">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Demo Mode Active</AlertTitle>
                <AlertDescription className="mt-2">
                  <p>This demo uses mock responses due to CORS restrictions that prevent browser-based 
                  applications from directly calling the Claude API.</p>
                  
                  <div className="mt-3 p-3 bg-card rounded-md border text-xs font-mono">
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-1.5">
                        <Server className="h-3.5 w-3.5" />
                        <span className="font-medium">Next.js Implementation:</span>
                      </p>
                      <p className="pl-5 flex items-start">
                        <ArrowRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Create API route at <code>app/api/generate-code/route.ts</code></span>
                      </p>
                      <p className="pl-5 flex items-start">
                        <ArrowRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Add Claude API key to <code>.env.local</code></span>
                      </p>
                      <p className="pl-5 flex items-start">
                        <ArrowRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Update client to call your API route</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                      <FileCode className="h-3.5 w-3.5" />
                      View API Route Example
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Claude API Docs
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <CodePreview 
            code={isGeneratingAnimation ? displayCode : getCombinedCode()} 
            title="Shopify Liquid Template" 
            isGenerating={isGeneratingAnimation}
            currentLine={currentLine}
          />
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
