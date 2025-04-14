
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  User, 
  ChevronDown, 
  Moon,
  Sun
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  // This would be connected to a theme provider in a real implementation
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header 
      className={cn(
        "h-16 border-b border-border flex items-center justify-between",
        "fixed top-0 right-0 z-30 bg-background/80 backdrop-blur-md",
        sidebarCollapsed ? "left-16" : "left-64",
        "transition-all duration-300"
      )}
    >
      <div className="px-6">
        <h1 className="text-xl font-semibold">Generate Shopify Section</h1>
      </div>
      
      <div className="flex items-center px-6 space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="relative"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span>Guest</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              Sign In
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
