
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
}

export function CodePreview({ code, isGenerating }: CodePreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "shopify-section-code.liquid";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Generated Code</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={isGenerating || !code}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span className="ml-1 hidden sm:inline">
                {copied ? "Copied" : "Copy"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCode}
              disabled={isGenerating || !code}
            >
              <Download size={14} />
              <span className="ml-1 hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        <div 
          className={cn(
            "flex-1 rounded-md font-mono text-sm overflow-auto",
            "border border-border bg-accent p-4",
            isGenerating && "animate-pulse"
          )}
        >
          {isGenerating ? (
            <div className="flex flex-col gap-2 h-full">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/5"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-4/5"></div>
            </div>
          ) : code ? (
            <pre className="whitespace-pre-wrap break-words">{code}</pre>
          ) : (
            <div className="text-muted-foreground h-full flex items-center justify-center">
              Generated code will appear here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
