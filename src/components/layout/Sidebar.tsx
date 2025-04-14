
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Code2, Home, Settings, History, Zap, 
  LogIn, ChevronLeft, ChevronRight, CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const iconSize = 20;
  
  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col",
        "border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <Code2 size={24} className="text-secondary" />
          {!collapsed && (
            <span className="ml-3 font-semibold text-lg">Shopify AI Scribe</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-1", collapsed && "absolute -right-4 top-6 bg-background border")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col flex-1 py-4">
        <NavItem icon={<Home size={iconSize} />} label="Dashboard" collapsed={collapsed} active />
        <NavItem icon={<History size={iconSize} />} label="History" collapsed={collapsed} />
        <NavItem icon={<CreditCard size={iconSize} />} label="Plans" collapsed={collapsed} />
        <NavItem icon={<Settings size={iconSize} />} label="Settings" collapsed={collapsed} />
      </div>

      <Separator />
      
      <div className="p-4">
        <CreditCounter credits={3} collapsed={collapsed} />
        <Button 
          className={cn(
            "w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90",
            collapsed ? "p-2" : "px-4 py-2"
          )}
        >
          {collapsed ? (
            <Zap size={iconSize} />
          ) : (
            <span className="flex items-center">
              <Zap size={iconSize} className="mr-2" />
              Upgrade Plan
            </span>
          )}
        </Button>
        <Button 
          variant="outline" 
          className={cn("w-full mt-2", collapsed ? "p-2" : "px-4 py-2")}
        >
          {collapsed ? (
            <LogIn size={iconSize} />
          ) : (
            <span className="flex items-center">
              <LogIn size={iconSize} className="mr-2" />
              Sign In
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
}

function NavItem({ icon, label, collapsed, active }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center justify-start my-1 w-full rounded-md",
        collapsed ? "px-2" : "px-4",
        active && "bg-accent text-accent-foreground"
      )}
    >
      <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
        <span className={cn(active && "text-secondary")}>{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </div>
    </Button>
  );
}

interface CreditCounterProps {
  credits: number;
  collapsed: boolean;
}

function CreditCounter({ credits, collapsed }: CreditCounterProps) {
  return (
    <div 
      className={cn(
        "rounded-md border p-2 flex items-center", 
        collapsed ? "justify-center" : "justify-between"
      )}
    >
      {!collapsed && <span className="text-sm">Daily Credits</span>}
      <div className="flex items-center">
        <div className={cn("bg-secondary/10 rounded-md px-2 py-1 text-secondary font-medium", collapsed ? "text-xs" : "text-sm")}>
          {credits}/3
        </div>
      </div>
    </div>
  );
}
