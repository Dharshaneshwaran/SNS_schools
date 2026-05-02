"use client";

import { useState, useRef, useEffect } from "react";
import { 
  PaperPlaneTilt, 
  Users, 
  UserCircle,
  MagnifyingGlass,
  DotsThreeVertical,
  UsersThree,
  Paperclip,
  ArrowBendUpLeft,
  X,
  Checks
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";

type MessageStatus = 'sent' | 'delivered' | 'read';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  date: string;
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
}

const contacts: Contact[] = [
  { id: 1, name: "Grade 10-A Parents", type: "Group", lastMsg: "When is the next meeting?", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Staff Lounge", type: "Group", lastMsg: "Lunch is ready!", time: "12:15 PM", unread: 0, online: true },
  { id: 3, name: "Dr. Sarah Connor", type: "Staff", lastMsg: "Syllabus updated.", time: "Yesterday", unread: 0, online: true },
  { id: 4, name: "Finance Office", type: "Staff", lastMsg: "Fee reports generated.", time: "2 days ago", unread: 0, online: false },
];

const initialMessages: Message[] = [
  { id: 1, sender: "Dr. Sarah Connor", text: "Hello Admin, have you reviewed the Grade 10 results?", time: "10:15 AM", date: "Today", isMe: false },
  { id: 2, sender: "Admin", text: "Yes Sarah, they look good. I'll publish them by 2 PM today.", time: "10:20 AM", date: "Today", isMe: true, status: 'read' },
  { id: 3, sender: "Dr. Sarah Connor", text: "Perfect. Thank you!", time: "10:21 AM", date: "Today", isMe: false },
];

export function ChatPage() {
  const { session } = useAuth();
  const [localContacts, setLocalContacts] = useState(contacts);
  const [selectedContact, setSelectedContact] = useState(localContacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isParent = session?.user?.role === "parent";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      sender: session?.user?.name || "User",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      isMe: true,
      status: 'sent',
      replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text, sender: replyingTo.sender } : undefined
    };
    setMessages([...messages, newMsg]);
    setInput("");
    setReplyingTo(null);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 500);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
    }, 1000);
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
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
        date: "Today",
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
    return <Checks size={14} weight="bold" className={status === 'read' ? 'text-blue-500' : 'text-slate-400'} />;
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    msgs.forEach(msg => {
      if (!grouped[msg.date]) grouped[msg.date] = [];
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex h-[calc(100vh-90px)] w-full overflow-hidden bg-slate-50">
      {/* Sidebar: Contacts */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="h-16 bg-white px-4 flex items-center justify-between border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Messages</h2>
          <div className="flex items-center gap-3">
            {!isParent && (
              <button title="New Group" onClick={handleNewGroup} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <UsersThree size={20} weight="bold" className="text-slate-600" />
              </button>
            )}
            <button title="Menu" onClick={() => alert("Settings menu")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <DotsThreeVertical size={20} weight="bold" className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b border-slate-200">
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
            <button 
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                selectedContact.id === contact.id ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-slate-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  {contact.type === 'Group' ? <Users size={24} weight="duotone" /> : <UserCircle size={24} weight="duotone" />}
                </div>
                {contact.online && contact.type !== 'Group' && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-sm font-medium text-slate-900 truncate">{contact.name}</div>
                  <div className={`text-xs ${contact.unread > 0 ? "text-blue-600 font-medium" : "text-slate-500"}`}>{contact.time}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500 truncate pr-2">{contact.lastMsg}</div>
                  {contact.unread > 0 && (
                    <div className="h-5 min-w-[20px] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )) : (
             <div className="p-8 text-center text-sm text-slate-500">
                No conversations found
             </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 bg-white px-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              {selectedContact.type === 'Group' ? <Users size={22} weight="duotone" /> : <UserCircle size={22} weight="duotone" />}
              {selectedContact.online && selectedContact.type !== 'Group' && (
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{selectedContact.name}</div>
              <div className="text-xs text-slate-500">
                {selectedContact.type === 'Group' ? `${Math.floor(Math.random() * 20) + 5} members` : selectedContact.online ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert("Search in conversation")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
               <MagnifyingGlass size={18} weight="bold" className="text-slate-600" />
            </button>
            <button onClick={() => alert("Conversation info")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
               <DotsThreeVertical size={18} weight="bold" className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white px-3 py-1 rounded-full text-xs text-slate-600 shadow-sm border border-slate-200">
                  {date}
                </div>
              </div>

              {/* Messages */}
              {msgs.map((msg, index) => {
                const prevMsg = index > 0 ? msgs[index - 1] : null;
                const showSender = !prevMsg || prevMsg.isMe !== msg.isMe;
                
                return (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-2 group`}>
                    <div className={`relative max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {/* Reply button on hover */}
                      <button 
                        onClick={() => handleReply(msg)}
                        className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-100 rounded-full p-1.5 shadow-md z-10"
                        title="Reply"
                      >
                        <ArrowBendUpLeft size={12} weight="bold" className="text-slate-600" />
                      </button>

                      <div 
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          msg.isMe 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-slate-900 border border-slate-200'
                        }`}
                      >
                        {/* Reply Preview */}
                        {msg.replyTo && (
                          <div className={`mb-2 pl-3 py-1.5 border-l-3 rounded ${msg.isMe ? 'border-blue-300 bg-blue-500/20' : 'border-slate-300 bg-slate-50'}`}>
                            <div className={`text-xs font-semibold ${msg.isMe ? 'text-blue-100' : 'text-slate-700'}`}>{msg.replyTo.sender}</div>
                            <div className={`text-xs ${msg.isMe ? 'text-blue-100' : 'text-slate-600'} truncate`}>{msg.replyTo.text}</div>
                          </div>
                        )}

                        {!msg.isMe && selectedContact.type === 'Group' && showSender && (
                          <div className="text-xs font-semibold text-orange-600 mb-1">{msg.sender}</div>
                        )}
                        
                        <div className="text-sm leading-relaxed break-words">
                          {msg.text}
                        </div>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                          <span>{msg.time}</span>
                          {msg.isMe && <MessageStatusIcon status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Bar */}
        {replyingTo && (
          <div className="bg-slate-100 px-6 py-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex-1 flex items-center gap-3">
              <ArrowBendUpLeft size={16} className="text-blue-600" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-blue-600">Replying to {replyingTo.sender}</div>
                <div className="text-xs text-slate-600 truncate">{replyingTo.text}</div>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-slate-200 rounded transition-colors">
              <X size={18} weight="bold" className="text-slate-600" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-white px-6 py-4 flex items-center gap-3 border-t border-slate-200">
          <label className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <Paperclip size={20} className="text-slate-600" />
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          
          <div className="flex-1 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
          
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <PaperPlaneTilt size={20} weight="fill" className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
