"use client";

import { useState } from "react";
import { 
  PaperPlaneTilt, 
  Users, 
  UserCircle,
  MagnifyingGlass,
  DotsThreeVertical,
  Circle,
  Smiley,
  Plus,
  UsersThree
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";

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
  const { session } = useAuth();
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const isParent = session?.user?.role === "parent";

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: session?.user?.name || "User",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInput("");
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
              <button title="New Group" className="hover:text-slate-700 transition-colors">
                <UsersThree size={22} weight="bold" />
              </button>
            )}
            <button title="Status" className="hover:text-slate-700 transition-colors">
              <Circle size={22} weight="bold" />
            </button>
            <button title="New Chat" className="hover:text-slate-700 transition-colors">
              <ChatCircleDots size={22} weight="bold" />
            </button>
            <button title="Menu" className="hover:text-slate-700 transition-colors">
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
              placeholder="Search or start new chat" 
              className="w-full bg-[#f0f2f5] rounded-lg pl-10 pr-4 py-1.5 text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {contacts.map((contact) => (
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
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start">
                  <div className="text-base font-normal text-slate-900 truncate">{contact.name}</div>
                  <div className={`text-xs ${contact.unread > 0 ? "text-[#25d366] font-medium" : "text-slate-500"}`}>{contact.time}</div>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <div className="text-[13px] text-slate-500 truncate pr-2">{contact.lastMsg}</div>
                  {contact.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-l border-slate-200 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
              {selectedContact.type === 'Group' ? <Users size={24} weight="duotone" /> : <UserCircle size={24} weight="duotone" />}
            </div>
            <div>
              <div className="text-base font-normal text-slate-900">{selectedContact.name}</div>
              <div className="text-[11px] text-slate-500">online</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-500 pr-2">
            <MagnifyingGlass size={20} weight="bold" />
            <DotsThreeVertical size={20} weight="bold" />
          </div>
        </div>

        {/* Messages with WhatsApp background */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 whatsapp-bg relative">
          {messages.map((msg, index) => {
            const isFirstInSequence = index === 0 || messages[index - 1].isMe !== msg.isMe;
            return (
              <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} ${isFirstInSequence ? 'mt-3' : 'mt-0'}`}>
                <div className={`relative max-w-[65%] px-3 py-1.5 shadow-sm ${
                  msg.isMe 
                    ? 'bg-[#dcf8c6] text-[#303030] rounded-lg rounded-tr-none' 
                    : 'bg-white text-[#303030] rounded-lg rounded-tl-none'
                }`}>
                  {/* Bubble Tail */}
                  {isFirstInSequence && (
                    <div className={`absolute top-0 w-3 h-3 ${
                      msg.isMe 
                        ? 'right-[-8px] border-l-[10px] border-l-[#dcf8c6] border-b-[10px] border-b-transparent' 
                        : 'left-[-8px] border-r-[10px] border-r-white border-b-[10px] border-b-transparent'
                    }`} />
                  )}
                  
                  {!msg.isMe && selectedContact.type === 'Group' && (
                    <div className="text-[12px] font-bold text-[#FF7F50] mb-0.5">{msg.sender}</div>
                  )}
                  <div className="text-[14.5px] leading-relaxed break-words">
                    {msg.text}
                    <span className="inline-block w-12 h-1" /> {/* Spacer for time */}
                  </div>
                  <div className="absolute bottom-1 right-2 text-[10px] text-slate-500 flex items-center gap-1">
                    {msg.time}
                    {msg.isMe && (
                      <span className="text-[#34b7f1]">
                        <svg viewBox="0 0 16 15" width="16" height="15" fill="currentColor">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879 5.517 6.43a.355.355 0 0 0-.503-.016l-.427.387a.368.368 0 0 0-.011.516l3.82 4.183a.368.368 0 0 0 .542.022l6.143-7.712a.365.365 0 0 0-.06-.516zm-5.045 0l-.478-.372a.365.365 0 0 0-.51.063L4.12 7.828l-.513-.561a.368.368 0 0 0-.542-.023l-3.003 3.77a.368.368 0 0 0 .063.518l.478.373a.365.365 0 0 0 .51-.063l2.766-3.473 1.134 1.242a.368.368 0 0 0 .542.022l4.981-6.262a.365.365 0 0 0-.063-.518z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Authentic WhatsApp Input Bar */}
        <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 text-slate-500">
            <Smiley size={26} />
            <Plus size={26} />
          </div>
          <div className="flex-1 bg-white rounded-lg px-4 py-2.5">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message"
              className="w-full bg-transparent border-none outline-none text-[15px] text-[#303030]"
            />
          </div>
          <button 
            onClick={handleSendMessage}
            className="text-slate-500 hover:text-[#25d366] transition-colors"
          >
            <PaperPlaneTilt size={26} weight="fill" />
          </button>
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

