"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChatCircleDots, 
  PaperPlaneTilt, 
  Users, 
  UserCircle,
  MagnifyingGlass,
  DotsThreeVertical,
  Circle
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const contacts = [
  { id: 1, name: "Grade 10-A Parents", type: "Group", lastMsg: "When is the next meeting?", time: "10:30 AM", unread: 2 },
  { id: 2, name: "Staff Lounge", type: "Group", lastMsg: "Lunch is ready!", time: "12:15 PM", unread: 0 },
  { id: 3, name: "Dr. Sarah Connor", type: "Staff", lastMsg: "Syllabus updated.", time: "Yesterday", unread: 0 },
  { id: 4, name: "Finance Office", type: "Staff", lastMsg: "Fee reports generated.", time: "2 days ago", unread: 0 },
];

const initialMessages = [
  { id: 1, sender: "Dr. Sarah Connor", text: "Hello Admin, have you reviewed the Grade 10 results?", time: "10:15 AM", isMe: false },
  { id: 2, sender: "Admin", text: "Yes Sarah, they look good. I'll publish them by 2 PM today.", time: "10:20 AM", isMe: true },
  { id: 3, sender: "Dr. Sarah Connor", text: "Perfect. Thank you!", time: "10:21 AM", isMe: false },
];

export function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "Admin",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <PageSection
      eyebrow="Internal Communication"
      title="Messaging Hub"
      description="Secure, real-time communication channel for SNS Academy staff, parents, and departments."
    >
      <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)] h-[700px] flex">
        
        {/* Sidebar: Contacts */}
        <div className="w-80 border-r border-slate-100 flex flex-col">
           <div className="p-6 border-b border-slate-50">
              <div className="relative">
                 <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search chats..." 
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#FF7F50] transition-colors"
                 />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {contacts.map((contact) => (
                <button 
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                    selectedContact.id === contact.id ? "bg-[#FF7F50]/5 border border-[#FF7F50]/20" : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="relative">
                     <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        {contact.type === 'Group' ? <Users size={24} weight="duotone" /> : <UserCircle size={24} weight="duotone" />}
                     </div>
                     <Circle size={10} weight="fill" className="absolute bottom-0 right-0 text-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <div className="text-sm font-bold text-slate-900 truncate">{contact.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{contact.time}</div>
                     </div>
                     <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-slate-500 truncate pr-4">{contact.lastMsg}</div>
                        {contact.unread > 0 && (
                          <div className="h-5 w-5 rounded-full bg-[#FF7F50] text-white text-[10px] font-bold flex items-center justify-center">
                             {contact.unread}
                          </div>
                        )}
                     </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
           {/* Chat Header */}
           <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    {selectedContact.type === 'Group' ? <Users size={20} weight="duotone" /> : <UserCircle size={20} weight="duotone" />}
                 </div>
                 <div>
                    <div className="text-sm font-bold text-slate-900">{selectedContact.name}</div>
                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</div>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                 <DotsThreeVertical size={24} className="hover:text-slate-600 transition-colors cursor-pointer" />
              </div>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {!msg.isMe && <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest px-1">{msg.sender}</div>}
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                        msg.isMe 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                         {msg.text}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-2 px-1">{msg.time}</div>
                   </div>
                </div>
              ))}
           </div>

           {/* Input Bar */}
           <div className="p-8 bg-white border-t border-slate-100">
              <div className="flex items-center gap-4 bg-slate-50 rounded-[2rem] border border-slate-100 pl-6 pr-2 py-2">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Type your message here..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-900 placeholder-slate-400"
                 />
                 <button 
                   onClick={handleSendMessage}
                   className="h-12 w-12 rounded-full bg-[#FF7F50] text-white flex items-center justify-center shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                 >
                    <PaperPlaneTilt size={24} weight="fill" />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </PageSection>
  );
}
