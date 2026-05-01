"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  PaperPlaneTilt, 
  MagnifyingGlass,
  DotsThreeVertical,
  Check,
  Checks,
  Paperclip,
  Microphone,
  Lock,
  LockOpen,
  ChatCircle,
  CaretLeft,
  Smiley
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";
import { chatService, type Contact, type Message } from "../../services/chat-service";

export function ChatPage() {
  const { session } = useAuth();
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [studentsCanMessage, setStudentsCanMessage] = useState(false); 
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Conversations & Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    async function loadConversations() {
      if (!session?.accessToken) return;
      try {
        const contacts = await chatService.getConversations(session.accessToken);
        setLocalContacts(contacts);
        
        // Update the selected contact object to stay in sync with latest metadata (unread, etc)
        if (selectedContact) {
          const updatedSelected = contacts.find(c => c.id === selectedContact.id);
          if (updatedSelected) {
            setSelectedContact(prev => ({
              ...prev!,
              online: updatedSelected.online,
              unread: updatedSelected.unread, // This will likely be 0 if we just fetched history
              lastMsg: updatedSelected.lastMsg,
              time: updatedSelected.time
            }));
          }
        }

        if (contacts.length > 0 && !selectedContact && !showChatOnMobile) {
          if (window.innerWidth > 768) {
            setSelectedContact(contacts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
    interval = setInterval(loadConversations, 3000);

    return () => clearInterval(interval);
  }, [session?.accessToken, selectedContact?.id, showChatOnMobile]);

  // Load Messages & Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    async function loadMessages() {
      if (!session?.accessToken || !selectedContact) return;
      try {
        const history = await chatService.getHistory(session.accessToken, selectedContact.id);
        
        // Only update if messages actually changed to prevent jitter
        setMessages(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(history)) {
            return history;
          }
          return prev;
        });
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }

    if (selectedContact) {
      loadMessages();
      interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedContact?.id, session?.accessToken]);

  const isAdmin = session?.user?.role === "admin";
  const isTeacher = session?.user?.role === "teacher" || isAdmin;
  const isParent = session?.user?.role === "parent";
  const isStudentSelected = selectedContact?.type === "Student";
  const canStudentMessage = studentsCanMessage || !isStudentSelected;

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedContact || !session?.accessToken) return;
    
    // Extra security check for student messaging
    if (isStudentSelected && !isAdmin && !studentsCanMessage) return;

    try {
      const sentMsg = await chatService.sendMessage(session.accessToken, selectedContact.id, input);
      setMessages(prev => [...prev, sentMsg]);
      setInput("");
      // Force immediate update of conversation list
      const contacts = await chatService.getConversations(session.accessToken);
      setLocalContacts(contacts);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredContacts = localContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#FF7F50] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full min-h-0 w-full overflow-hidden bg-white relative">
      {/* Sidebar: Contacts */}
      <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] lg:w-[400px] border-r border-[#F1F5F9] flex flex-col bg-white shrink-0`}>
        {/* Branded Chat Sidebar Header */}
        <div className="h-[64px] bg-white px-6 flex items-center justify-between flex-shrink-0 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <ChatCircle size={24} weight="fill" className="text-[#FF7F50]" />
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Messages</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button title="Menu" className="p-2 hover:bg-slate-50 rounded-xl transition-all"><DotsThreeVertical size={20} weight="bold" /></button>
          </div>
        </div>

        <div className="p-4 border-b border-[#F1F5F9]">
          <div className="relative flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#FF7F50]/20 focus-within:border-[#FF7F50]/50">
            <MagnifyingGlass size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-600 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setShowChatOnMobile(true);
              }}
              className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all border-b border-[#F1F5F9] relative ${
                selectedContact?.id === contact.id ? "bg-orange-50/50" : "hover:bg-slate-50"
              }`}
            >
              {selectedContact?.id === contact.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF7F50]" />
              )}
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm border-2 border-white">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} alt={contact.name} />
                </div>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[15px] truncate font-bold ${selectedContact?.id === contact.id ? "text-[#FF7F50]" : "text-slate-900"}`}>{contact.name}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-tighter ${contact.unread > 0 ? "text-[#FF7F50]" : "text-slate-400"}`}>{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[13px] text-slate-500 truncate flex items-center gap-1 font-medium">
                    {contact.lastMsg || `${contact.type} • ${contact.role}`}
                  </div>
                  {contact.unread > 0 && (
                    <div className="min-w-[18px] h-[18px] rounded-full bg-[#FF7F50] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${showChatOnMobile ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col relative bg-[#f8fafc] min-w-0`}>
        {selectedContact ? (
          <>
            <div className="h-[64px] bg-white px-6 flex items-center justify-between border-b border-[#F1F5F9] shrink-0 z-10 shadow-sm shadow-slate-100/50">
              <div className="flex items-center gap-4 cursor-pointer min-w-0">
                <button 
                  onClick={() => setShowChatOnMobile(false)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>
                <div className="h-11 w-11 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 shrink-0 shadow-sm">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedContact.name}`} alt={selectedContact.name} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[15px] font-bold text-slate-900 truncate leading-tight">{selectedContact.name}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    {isStudentSelected ? (studentsCanMessage ? "Messaging enabled" : "Read-only channel") : "online"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400 shrink-0">
                 {isAdmin && isStudentSelected && (
                   <button 
                    onClick={() => setStudentsCanMessage(!studentsCanMessage)}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all border shadow-sm ${
                      studentsCanMessage 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                    title="Toggle Student Messaging"
                   >
                     {studentsCanMessage ? <LockOpen size={14} weight="bold" /> : <Lock size={14} weight="bold" />}
                     {studentsCanMessage ? "MESSAGING ON" : "MESSAGING OFF"}
                   </button>
                 )}
                 <button title="Menu" className="p-2 hover:bg-slate-50 rounded-xl transition-all"><DotsThreeVertical size={20} weight="bold" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative min-h-0 hide-scrollbar">
              {/* Subtle Branded Background Pattern */}
              <div className="absolute inset-0 bg-chat-pattern opacity-[0.04] pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 gap-4">
                    <ChatCircle size={48} weight="duotone" className="opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === session?.user?.id;
                    const msgDate = new Date(msg.timestamp).toDateString();
                    const prevMsgDate = index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;
                    const showDateHeader = msgDate !== prevMsgDate;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateHeader && (
                          <div className="flex justify-center my-8">
                            <span className="px-4 py-1.5 rounded-xl bg-white shadow-sm border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              {msgDate === new Date().toDateString() ? 'Today' : 
                               msgDate === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : msgDate}
                            </span>
                          </div>
                        )}
                        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`relative max-w-[85%] md:max-w-[70%] min-w-[120px] px-4 pt-3 pb-5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] rounded-2xl ${
                            isMe ? 'bg-[#FF7F50] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                          }`}>
                            <div className={`text-[14.5px] leading-relaxed break-words ${isMe ? 'font-medium' : 'font-normal'}`}>
                              {msg.text}
                            </div>
                            <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold uppercase tracking-tighter leading-none ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <span className={msg.status === 'read' ? 'text-white' : 'text-white/50'}>
                                   {msg.status === 'sent' ? <Check size={12} weight="bold" /> : <Checks size={14} weight="bold" />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="bg-white px-6 py-5 flex items-center gap-4 shrink-0 border-t border-[#F1F5F9] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.03)] z-20">
               {!canStudentMessage && !isAdmin ? (
                 <div className="flex-1 flex items-center justify-center py-3 bg-slate-50 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest gap-3 text-center px-6 border border-slate-100">
                    <Lock size={16} weight="bold" className="shrink-0" />
                    <span className="truncate">Student messaging disabled by admin</span>
                 </div>
               ) : (
                 <>
                   <div className="hidden sm:flex items-center gap-1 text-slate-400">
                      <button className="p-2.5 hover:bg-slate-50 hover:text-[#FF7F50] rounded-xl transition-all"><Smiley size={24} weight="bold" /></button>
                      <button className="p-2.5 hover:bg-slate-50 hover:text-[#FF7F50] rounded-xl transition-all"><Paperclip size={24} weight="bold" /></button>
                   </div>
                   <div className="flex-1 flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF7F50]/10 transition-all min-w-0">
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={canStudentMessage ? "Write your message..." : "Admin override mode..."}
                        className="w-full bg-transparent border-none outline-none text-[15px] text-slate-700 font-medium placeholder:text-slate-400"
                      />
                   </div>
                   <div className="shrink-0">
                     {input.trim() ? (
                       <button onClick={handleSendMessage} className="w-12 h-12 bg-[#FF7F50] text-white rounded-2xl shadow-[0_8px_20px_-4px_rgba(255,127,80,0.4)] hover:bg-[#e66a3e] hover:shadow-[0_10px_25px_-5px_rgba(255,127,80,0.5)] transition-all transform active:scale-95 flex items-center justify-center"><PaperPlaneTilt size={22} weight="fill" /></button>
                     ) : (
                       <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#FF7F50] hover:bg-slate-100 rounded-xl transition-all"><Microphone size={24} weight="bold" /></button>
                     )}
                   </div>
                 </>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-chat-pattern opacity-[0.03]" />
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
               <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-6">
                  <ChatCircle size={40} weight="fill" className="text-[#FF7F50]" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Select a Conversation</h3>
               <p className="text-slate-400 text-sm font-medium">Choose a contact from the sidebar to start messaging in real-time.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-chat-pattern {
          background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
          background-repeat: repeat;
        }
      `}</style>
    </div>
  );
}
