
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { getAllChats, createNewChat, clearAllChats, deleteChat } from '@/services/chatHistoryService';
import { useToast } from '@/hooks/use-toast';
import { ChatHistoryItem } from '@/types';

const ChatSidebar = () => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Load chat history from localStorage and set active chat
  useEffect(() => {
    const chats = getAllChats();
    setChatHistory(chats);
    
    // Check if there's a chat ID in the URL params
    const searchParams = new URLSearchParams(location.search);
    const chatId = searchParams.get('chatId');
    
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, [location]);

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
    navigate('/?chatId=' + newChat.id);
    setActiveChatId(newChat.id);
    
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
      navigate('/');
      setActiveChatId(null);
      
      toast({
        title: "Chat history cleared",
        description: "All your conversation history has been removed",
        variant: "destructive"
      });
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      
      if (activeChatId === chatId) {
        navigate('/');
        setActiveChatId(null);
      }
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });
    }
  };

  const handleChatSelect = (chatId: string) => {
    navigate('/?chatId=' + chatId);
    setActiveChatId(chatId);
    
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
                        data-active={activeChatId === chat.id}
                        className="flex justify-between pr-1 group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <History className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
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
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Log out">
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
