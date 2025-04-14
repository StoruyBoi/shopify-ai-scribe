
import React, { useState, useEffect } from 'react';
import { History, PanelLeft, LogOut, Crown, Plus, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { getAllChats, createNewChat, clearAllChats } from '@/services/chatHistoryService';
import { useToast } from '@/hooks/use-toast';
import { ChatHistoryItem } from '@/types';

const ChatSidebar = () => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  
  useEffect(() => {
    // Load chat history from localStorage
    setChatHistory(getAllChats());
  }, []);

  // Group chat history by date
  const groupedChats = chatHistory.reduce<Record<string, ChatHistoryItem[]>>((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {});

  const handleNewChat = () => {
    const newChat = createNewChat();
    setChatHistory(prev => [newChat, ...prev]);
    toast({
      title: "New chat created",
      description: "You can now start a new conversation"
    });
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      clearAllChats();
      setChatHistory([]);
      toast({
        title: "Chat history cleared",
        description: "All your conversation history has been removed",
        variant: "destructive"
      });
    }
  };

  const handleChatSelect = (chatId: string) => {
    // In a real implementation, this would load the selected chat
    toast({
      title: "Chat selected",
      description: `Selected chat ID: ${chatId.substring(0, 8)}...`,
    });
    
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  return (
    <>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Sidebar>
        <SidebarHeader className="flex flex-col gap-0 p-0">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">Shopify Wizard</span>
            </div>
            <SidebarTrigger />
          </div>
          
          <div className="p-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              size="sm"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4" />
              <span>New chat</span>
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="overflow-y-auto pb-20">
          {Object.entries(groupedChats).map(([date, chats]) => (
            <SidebarGroup key={date}>
              <SidebarGroupLabel>{date}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton 
                        onClick={() => handleChatSelect(chat.id)}
                        tooltip={chat.title}
                      >
                        <History className="h-4 w-4" />
                        <span>{chat.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          
          {chatHistory.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <History className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No conversation history</p>
              <p className="text-xs mt-1">Start a new chat to begin</p>
            </div>
          )}
        </SidebarContent>
        
        <SidebarFooter className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur">
          <div className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-primary" 
              size="sm"
            >
              <Crown className="h-4 w-4" />
              <span className="font-medium">Upgrade plan</span>
              <span className="text-xs ml-auto opacity-60">More features</span>
            </Button>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">User Account</div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive/80"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default ChatSidebar;
