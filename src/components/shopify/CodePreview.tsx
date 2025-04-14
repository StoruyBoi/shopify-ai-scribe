
import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Code as CodeIcon, Download, Terminal, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface CodePreviewProps {
  code: string;
  title?: string;
  codeRef?: React.RefObject<HTMLPreElement>;
  isGenerating?: boolean;
  currentLine?: number;
}

const CodePreview: React.FC<CodePreviewProps> = ({ 
  code, 
  title = 'Shopify Liquid Code',
  codeRef: externalCodeRef,
  isGenerating = false,
  currentLine = 0
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const internalCodeRef = useRef<HTMLPreElement>(null);
  const codeRef = externalCodeRef || internalCodeRef;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse code into HTML, CSS and Schema sections
  const parseCode = (fullCode: string) => {
    const htmlMatch = fullCode.match(/<div class="section-.*?">([\s\S]*?)<\/div>/);
    const cssMatch = fullCode.match(/\.section-.*?}([\s\S]*?)@media/);
    const schemaMatch = fullCode.match(/{% schema %}([\s\S]*?){% endschema %}/);

    return {
      html: htmlMatch ? htmlMatch[0] : '',
      css: cssMatch ? cssMatch[0] : '',
      schema: schemaMatch ? schemaMatch[1] : ''
    };
  };
  
  const parsedCode = parseCode(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it into your Shopify theme editor",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopify-section.liquid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded",
      description: "You can now use it in your Shopify theme editor",
    });
  };

  // Add syntax highlighting effect
  useEffect(() => {
    if (codeRef.current) {
      // Escape HTML entities first
      const escapeHtml = (text: string) => {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };
      
      let displayCode = code;
      if (activeTab === 'html') displayCode = parsedCode.html;
      if (activeTab === 'css') displayCode = parsedCode.css;
      if (activeTab === 'schema') displayCode = parsedCode.schema;
      
      const escapedCode = escapeHtml(displayCode);
      
      // Simple syntax highlighting for Liquid
      const highlightedCode = escapedCode
        .replace(/({%.*?%})/g, '<span class="text-blue-400">$1</span>')
        .replace(/({{.*?}})/g, '<span class="text-green-400">$1</span>')
        .replace(/(&lt;.*?&gt;)/g, '<span class="text-purple-400">$1</span>')
        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-gray-400">$1</span>');
      
      codeRef.current.innerHTML = highlightedCode;
      
      // Auto-scroll to the latest line when generating
      if (isGenerating && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [code, codeRef, isGenerating, activeTab, parsedCode]);

  return (
    <div className="rounded-lg border overflow-hidden bg-card">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <CodeIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">{title}</h3>
            {isGenerating && (
              <div className="flex items-center gap-1.5 ml-2 text-xs text-primary font-mono">
                <Terminal className="h-3 w-3 animate-pulse" />
                <span className="animate-pulse">Generating...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3 py-1 h-7">All</TabsTrigger>
              <TabsTrigger value="html" className="text-xs px-3 py-1 h-7">HTML</TabsTrigger>
              <TabsTrigger value="css" className="text-xs px-3 py-1 h-7">CSS</TabsTrigger>
              <TabsTrigger value="schema" className="text-xs px-3 py-1 h-7">Schema</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-1 ml-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload}
                disabled={isGenerating || !code}
                className="h-7 px-2 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="ml-1">Download</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                disabled={isGenerating || !code}
                className="h-7 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="ml-1">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="ml-1">Copy</span>
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                title="Expand"
              >
                <Expand className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
      
      <div className="p-4 bg-muted/5 relative">
        <div 
          ref={containerRef}
          className="overflow-y-auto max-h-[600px]"
        >
          <pre 
            ref={codeRef}
            className={`text-xs md:text-sm p-3 rounded bg-background/80 border font-mono overflow-x-auto ${isGenerating ? 'border-primary/40' : 'border-border'}`}
          >
            <code>{code}</code>
          </pre>
          
          {isGenerating && code && (
            <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-md font-mono">
              Line {code.split('\n').length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
