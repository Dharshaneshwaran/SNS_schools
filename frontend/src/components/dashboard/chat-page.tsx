"use client";

import { useState, useRef, useEffect } from "react";
import { 
  PaperPlaneTilt, 
  Users, 
  UserCircle,
  MagnifyingGlass,
  DotsThreeVertical,
  Circle,
  Smiley,
  Plus,
  UsersThree,
  Microphone,
  ArrowBendUpLeft,
  X,
  Check,
  Checks
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";

type MessageStatus = 'sent' | 'delivered' | 'read';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  status?: MessageStatus;
  replyTo?: { id: number; text: string; sender: string };
}

interface Contact {
  id: number;
  name: string;
  type: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  lastSeen?: string;
}

const contacts: Contact[] = [
  { id: 1, name: "Grade 10-A Parents", type: "Group", lastMsg: "When is the next meeting?", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Staff Lounge", type: "Group", lastMsg: "Lunch is ready!", time: "12:15 PM", unread: 0, online: true },
  { id: 3, name: "Dr. Sarah Connor", type: "Staff", lastMsg: "Syllabus updated.", time: "Yesterday", unread: 0, online: true, lastSeen: "online" },
  { id: 4, name: "Finance Office", type: "Staff", lastMsg: "Fee reports generated.", time: "2 days ago", unread: 0, online: false, lastSeen: "last seen today at 3:45 PM" },
];

const initialMessages: Message[] = [
  { id: 1, sender: "Dr. Sarah Connor", text: "Hello Admin, have you reviewed the Grade 10 results?", time: "10:15 AM", isMe: false },
  { id: 2, sender: "Admin", text: "Yes Sarah, they look good. I'll publish them by 2 PM today.", time: "10:20 AM", isMe: true, status: 'read' },
  { id: 3, sender: "Dr. Sarah Connor", text: "Perfect. Thank you!", time: "10:21 AM", isMe: false },
];

export function ChatPage() {
  const { session } = useAuth();
  const [localContacts, setLocalContacts] = useState(contacts);
  const [selectedContact, setSelectedContact] = useState(localContacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isParent = session?.user?.role === "parent";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [input]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      sender: session?.user?.name || "User",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
      replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text, sender: replyingTo.sender } : undefined
    };
    setMessages([...messages, newMsg]);
    setInput("");
    setReplyingTo(null);

    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 1000);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
    }, 2000);
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        const newMsg: Message = {
          id: messages.length + 1,
          sender: session?.user?.name || "User",
          text: "🎤 Voice message (0:05)",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          status: 'sent'
        };
        setMessages([...messages, newMsg]);
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleNewGroup = () => {
    const groupName = prompt("Enter new group name:");
    if (groupName && groupName.trim()) {
      const newGroup: Contact = {
        id: localContacts.length + 1,
        name: groupName.trim(),
        type: "Group",
        lastMsg: "Group created",
        time: "Just now",
        unread: 0,
        online: true
      };
      setLocalContacts([newGroup, ...localContacts]);
      setSelectedContact(newGroup);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: session?.user?.name || "User",
        text: `📎 ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent'
      };
      setMessages([...messages, newMsg]);
    }
  };

  const filteredContacts = localContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageStatusIcon = ({ status }: { status?: MessageStatus }) => {
    if (!status) return null;
    if (status === 'sent') return <Check size={16} weight="bold" className="text-slate-400" />;
    if (status === 'delivered') return <Checks size={16} weight="bold" className="text-slate-400" />;
    return <Checks size={16} weight="bold" className="text-[#34b7f1]" />;
  };

  return (
    <div className="flex h-[calc(100vh-90px)] w-full overflow-hidden bg-[#f0f2f5]">
      {/* Sidebar: Contacts */}
      <div className="w-[30%] min-w-[300px] border-r border-slate-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-slate-300 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || 'Admin'}`} alt="avatar" />
          </div>
          <div className="flex items-center gap-6 text-slate-500">
            {!isParent && (
              <button title="New Group" onClick={handleNewGroup} className="hover:text-slate-700 transition-colors">
                <UsersThree size={22} weight="bold" />
              </button>
            )}
            <button title="Status" onClick={() => alert("Status updates coming soon!")} className="hover:text-slate-700 transition-colors">
              <Circle size={22} weight="bold" />
            </button>
            <button title="New Chat" onClick={() => alert("Select a user to start chatting")} className="hover:text-slate-700 transition-colors">
              <ChatCircleDots size={22} weight="bold" />
            </button>
            <button title="Menu" onClick={() => alert("Settings menu coming soon")} className="hover:text-slate-700 transition-colors">
              <DotsThreeVertical size={22} weight="bold" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-white flex-shrink-0">
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat" 
              className="w-full bg-[#f0f2f5] rounded-lg pl-10 pr-4 py-1.5 text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
            <button 
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-50 ${
                selectedContact.id === contact.id ? "bg-[#f0f2f5]" : "hover:bg-[#f5f6f6]"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                  {contact.type === 'Group' ? <Users size={28} weight="duotone" /> : <UserCircle size={28} weight="duotone" />}
                </div>
                {contact.online && contact.type !== 'Group' && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#25d366] rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start">
                  <div className="text-base font-normal text-slate-900 truncate">{contact.name}</div>
                  <div className={`text-xs ${contact.unread > 0 ? "text-[#25d366] font-medium" : "text-slate-500"}`}>{contact.time}</div>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <div className="text-[13px] text-slate-500 truncate pr-2">{contact.lastMsg}</div>
                  {contact.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )) : (
             <div className="p-8 text-center text-sm text-slate-500">
                No chats found for "{searchQuery}"
             </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-l border-slate-200 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
              {selectedContact.type === 'Group' ? <Users size={24} weight="duotone" /> : <UserCircle size={24} weight="duotone" />}
              {selectedContact.online && selectedContact.type !== 'Group' && (
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#25d366] rounded-full border-2 border-[#f0f2f5]"></div>
              )}
            </div>
            <div>
              <div className="text-base font-normal text-slate-900">{selectedContact.name}</div>
              <div className="text-[11px] text-slate-500">
                {isTyping ? (
                  <span className="text-[#25d366]">typing...</span>
                ) : (
                  selectedContact.lastSeen || 'click here for contact info'
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-500 pr-2">
            <button onClick={() => alert("Search within chat coming soon")} className="hover:text-slate-700 transition-colors">
               <MagnifyingGlass size={20} weight="bold" />
            </button>
            <button onClick={() => alert("Chat options coming soon")} className="hover:text-slate-700 transition-colors">
               <DotsThreeVertical size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Messages with WhatsApp background */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 whatsapp-bg relative">
          {messages.map((msg, index) => {
            const isFirstInSequence = index === 0 || messages[index - 1].isMe !== msg.isMe;
            return (
              <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} ${isFirstInSequence ? 'mt-3' : 'mt-0'} group`}>
                <div 
                  className={`relative max-w-[65%] px-3 py-1.5 shadow-sm transition-all hover:shadow-md ${
                    msg.isMe 
                      ? 'bg-[#dcf8c6] text-[#303030] rounded-lg rounded-tr-none' 
                      : 'bg-white text-[#303030] rounded-lg rounded-tl-none'
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleReply(msg);
                  }}
                >
                  {/* Reply button on hover */}
                  <button 
                    onClick={() => handleReply(msg)}
                    className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-slate-200 rounded-full p-1 shadow-md"
                    title="Reply"
                  >
                    <ArrowBendUpLeft size={14} weight="bold" />
                  </button>

                  {/* Bubble Tail */}
                  {isFirstInSequence && (
                    <div className={`absolute top-0 w-3 h-3 ${
                      msg.isMe 
                        ? 'right-[-8px] border-l-[10px] border-l-[#dcf8c6] border-b-[10px] border-b-transparent' 
                        : 'left-[-8px] border-r-[10px] border-r-white border-b-[10px] border-b-transparent'
                    }`} />
                  )}
                  
                  {/* Reply Preview */}
                  {msg.replyTo && (
                    <div className={`mb-1 pl-2 py-1 border-l-4 ${msg.isMe ? 'border-[#25d366] bg-[#d1f4cc]' : 'border-[#34b7f1] bg-slate-50'} rounded text-xs`}>
                      <div className="font-semibold text-[#25d366]">{msg.replyTo.sender}</div>
                      <div className="text-slate-600 truncate">{msg.replyTo.text}</div>
                    </div>
                  )}

                  {!msg.isMe && selectedContact.type === 'Group' && (
                    <div className="text-[12px] font-bold text-[#FF7F50] mb-0.5">{msg.sender}</div>
                  )}
                  <div className="text-[14.5px] leading-relaxed break-words">
                    {msg.text}
                    <span className="inline-block w-16 h-1" /> {/* Spacer for time */}
                  </div>
                  <div className="absolute bottom-1 right-2 text-[10px] text-slate-500 flex items-center gap-1">
                    {msg.time}
                    {msg.isMe && <MessageStatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Bar */}
        {replyingTo && (
          <div className="bg-[#f0f2f5] px-4 py-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1 flex items-center gap-2">
              <ArrowBendUpLeft size={18} className="text-[#25d366]" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#25d366]">{replyingTo.sender}</div>
                <div className="text-xs text-slate-600 truncate">{replyingTo.text}</div>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-slate-700">
              <X size={20} weight="bold" />
            </button>
          </div>
        )}

        {/* Authentic WhatsApp Input Bar */}
        <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => alert("Emoji picker coming soon")} className="hover:text-slate-700 transition-colors">
              <Smiley size={26} />
            </button>
            <label className="hover:text-slate-700 transition-colors cursor-pointer">
              <Plus size={26} />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <div className="flex-1 bg-white rounded-lg px-4 py-2.5">
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message"
              className="w-full bg-transparent border-none outline-none text-[15px] text-[#303030]"
            />
          </div>
          {input.trim() ? (
            <button 
              onClick={handleSendMessage}
              className="text-slate-500 hover:text-[#25d366] transition-colors"
            >
              <PaperPlaneTilt size={26} weight="fill" />
            </button>
          ) : (
            <button 
              onClick={handleVoiceRecord}
              className={`transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-[#25d366]'}`}
            >
              <Microphone size={26} weight={isRecording ? "fill" : "regular"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Internal icon for sidebar (ChatCircleDots was used in header, need it here too)
function ChatCircleDots({ size, weight }: { size: number, weight: "bold" | "duotone" | "fill" | "light" | "regular" | "thin" }) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} fill="currentColor">
       <path d="M128,24A104,104,0,0,0,36.82,178.07,10,10,0,0,1,34,185.39L25.43,215.4a18,18,0,0,0,22.17,22.17l30-8.57a10,10,0,0,1,7.32-2.82A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,26.1,26.1,0,0,0-19.16,7.37L43.43,217.4,56.59,171a26,26,0,0,0-7.37-19.16A88,88,0,1,1,128,216Z"></path>
    </svg>
  );
}
