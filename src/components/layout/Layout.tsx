
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "./ChatSidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={!window.matchMedia('(max-width: 768px)').matches}>
      <div className="h-screen flex overflow-hidden bg-background">
        <ChatSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <footer className="border-t border-border py-4 bg-background z-10">
            <div className="container mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
              <div>Shopify Code Generator © 2025 • Powered by Claude 3.7</div>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-foreground">Privacy</a>
                <a href="#" className="hover:text-foreground">Terms</a>
                <a href="#" className="hover:text-foreground">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
