"use client";

import { useState, useRef, useEffect } from "react";
import { 
  PaperPlaneTilt, 
  MagnifyingGlass,
  DotsThreeVertical,
  UsersThree,
  Paperclip,
  ArrowBendUpLeft,
  X,
  Checks,
  ChatCircle,
  UserPlus,
  PencilSimple,
  Star,
  Bell,
  Lock,
  ShieldCheck,
  SignOut
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

import { 
  getGroups, 
  getMessages, 
  sendMessage as apiSendMessage, 
  addMember as apiAddMember,
} from "../../services/messaging-service";

export function ChatPage() {
  const { session } = useAuth();
  const [localContacts, setLocalContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [isViewingMembers, setIsViewingMembers] = useState(false);
  const [isViewingGroupInfo, setIsViewingGroupInfo] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isParent = session?.user?.role === "parent";

  const fetchGroups = async () => {
    try {
      const groups = await getGroups();
      setLocalContacts(groups.map(g => ({
        id: g.id,
        name: g.name,
        type: "Group",
        lastMsg: "Select to view messages",
        time: "Now",
        unread: 0,
        online: true,
        description: g.description,
        members: g.members
      })));
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const fetchMessages = async (groupId: string) => {
    try {
      const msgs = await getMessages(groupId);
      setMessages(msgs.map(m => ({
        id: m.id,
        sender: m.sender.name,
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        isMe: m.senderId === session?.user?.id,
        status: 'read'
      })));
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenAddMembers = async () => {
    setIsAddingMembers(true);
    setIsLoadingUsers(true);
    setFetchError(null);
    try {
      const { getAllUsers } = await import("../../services/users-service");
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setFetchError(err instanceof Error ? err.message : "Failed to load directory");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedContact) return;
    try {
      await apiAddMember(selectedContact.id, userId);
      alert("Member added successfully");
      setIsAddingMembers(false);
      fetchGroups(); 
    } catch (err) {
      alert("Failed to add member");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedContact) return;
    
    try {
      await apiSendMessage(selectedContact.id, input);
      setInput("");
      fetchMessages(selectedContact.id);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleConfirmCreateGroup = async () => {
    if (newGroupName.trim()) {
      try {
        const { createGroup } = await import("../../services/messaging-service");
        await createGroup(newGroupName.trim(), newGroupDescription || "");
        setIsCreatingGroup(false);
        setNewGroupName("");
        setNewGroupDescription("");
        fetchGroups();
      } catch (err) {
        setFetchError("Failed to create group");
      }
    }
  };

  const handleEditGroup = async () => {
    if (!selectedContact) return;
    setNewGroupName(selectedContact.name);
    setNewGroupDescription(selectedContact.description || "");
    setIsCreatingGroup(true); // Reusing create modal for edit simulation
  };

  const handleNewGroup = async () => {
    setNewGroupName("");
    setNewGroupDescription("");
    setIsCreatingGroup(true);
  };

  const handleReply = (msg: any) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMsg: any = {
        id: Date.now().toString(),
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

  const MessageStatusIcon = ({ status }: { status?: string }) => {
    if (!status) return null;
    return <Checks size={14} weight="bold" className={status === 'read' ? 'text-orange-500' : 'text-slate-400'} />;
  };

  const groupMessagesByDate = (msgs: any[]) => {
    const grouped: { [key: string]: any[] } = {};
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
              <button title="New Group" onClick={handleNewGroup} className="p-2 hover:bg-orange-50 rounded-lg transition-colors group">
                <UsersThree size={20} weight="bold" className="text-slate-600 group-hover:text-orange-500" />
              </button>
            )}
            <button title="Menu" onClick={() => {}} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
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
              className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
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
                selectedContact?.id === contact.id ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-slate-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  {contact.type === 'Group' ? <UsersThree size={24} weight="duotone" /> : <Checks size={24} weight="duotone" />}
                </div>
                {contact.online && contact.type !== 'Group' && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-orange-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-sm font-medium text-slate-900 truncate">{contact.name}</div>
                  <div className={`text-xs ${contact.unread > 0 ? "text-orange-600 font-medium" : "text-slate-500"}`}>{contact.time}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500 truncate pr-2">{contact.lastMsg}</div>
                  {contact.unread > 0 && (
                    <div className="h-5 min-w-[20px] px-1.5 rounded-full bg-orange-600 text-white text-[10px] font-semibold flex items-center justify-center">
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
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white px-6 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                   <UsersThree size={22} weight="duotone" className="text-orange-500" />
                </div>
                <button 
                  onClick={() => setIsViewingGroupInfo(true)}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <div className="text-sm font-semibold text-slate-900">{selectedContact.name}</div>
                  <div className="text-xs text-slate-500">
                    {selectedContact.members?.length || 0} members
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {!isParent && (
                  <button 
                    onClick={handleOpenAddMembers} 
                    title="Add members"
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-all border border-orange-100"
                  >
                    <UserPlus size={16} weight="bold" />
                    Add Members
                  </button>
                )}
                <button onClick={() => {}} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MagnifyingGlass size={18} weight="bold" className="text-slate-600" />
                </button>
                <button onClick={() => setIsViewingGroupInfo(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
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
                  {msgs.map((msg: any, index: number) => {
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
                                ? 'bg-orange-600 text-white' 
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                          >
                            {/* Reply Preview */}
                            {msg.replyTo && (
                              <div className={`mb-2 pl-3 py-1.5 border-l-3 rounded ${msg.isMe ? 'border-orange-300 bg-orange-500/20' : 'border-slate-300 bg-slate-50'}`}>
                                <div className={`text-xs font-semibold ${msg.isMe ? 'text-orange-100' : 'text-slate-700'}`}>{msg.replyTo.sender}</div>
                                <div className={`text-xs ${msg.isMe ? 'text-orange-100' : 'text-slate-600'} truncate`}>{msg.replyTo.text}</div>
                              </div>
                            )}

                            {!msg.isMe && showSender && (
                              <div className="text-xs font-semibold text-orange-600 mb-1">{msg.sender}</div>
                            )}
                            
                            <div className="text-sm leading-relaxed break-words">
                              {msg.text}
                            </div>
                            
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-orange-100' : 'text-slate-500'}`}>
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
              <div className="bg-orange-50 px-6 py-2 flex items-center justify-between border-t border-orange-100">
                <div className="flex-1 flex items-center gap-3">
                  <ArrowBendUpLeft size={16} className="text-orange-600" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-orange-600">Replying to {replyingTo.sender}</div>
                    <div className="text-xs text-slate-600 truncate">{replyingTo.text}</div>
                  </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-orange-100 rounded transition-colors">
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
              
              <div className="flex-1 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
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
                className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <PaperPlaneTilt size={20} weight="fill" className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
               <ChatCircle size={40} weight="duotone" className="text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Your Messages</h3>
            <p className="text-sm text-slate-500 max-w-[280px] text-center mt-2">
              Select a conversation from the sidebar to start messaging.
            </p>
          </div>
        )}
      </div>

      {/* Group Info Slide-over */}
      {isViewingGroupInfo && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsViewingGroupInfo(false)} />
          <div className="relative w-full max-w-md bg-slate-50 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-16 bg-white px-6 flex items-center gap-6 border-b border-slate-200">
              <button onClick={() => setIsViewingGroupInfo(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} weight="bold" className="text-slate-600" />
              </button>
              <h3 className="text-lg font-bold text-slate-800">Group info</h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white p-8 flex flex-col items-center border-b border-slate-100 mb-2">
                <div className="h-40 w-40 rounded-full bg-slate-100 flex items-center justify-center mb-6 relative group cursor-pointer shadow-inner">
                  <UsersThree size={80} weight="duotone" className="text-orange-500" />
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedContact?.name}</h2>
                  <button onClick={handleEditGroup} className="p-1.5 hover:bg-orange-50 rounded-lg text-slate-400 hover:text-orange-500 transition-all">
                    <PencilSimple size={20} weight="bold" />
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-500">Group · {selectedContact?.members?.length || 0} members</p>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-4 flex justify-center gap-4 border-b border-slate-100 mb-2">
                <button onClick={handleOpenAddMembers} className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl hover:bg-orange-50 transition-all border border-slate-100 group">
                  <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus size={24} weight="bold" />
                  </div>
                  <span className="text-xs font-bold text-orange-600">Add</span>
                </button>
                <button onClick={() => {}} className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 group">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MagnifyingGlass size={24} weight="bold" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Search</span>
                </button>
              </div>

              {/* Description Section */}
              <div className="bg-white px-6 py-5 border-b border-slate-100 mb-2 group">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">Description</span>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed font-medium">
                   {selectedContact?.description || "Welcome to the group."}
                 </p>
              </div>

              {/* Members Section */}
              <div className="bg-white p-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">{selectedContact?.members?.length || 0} members</h4>
                </div>
                <div className="space-y-4">
                   <button onClick={handleOpenAddMembers} className="w-full flex items-center gap-4 group">
                     <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <UserPlus size={20} weight="bold" />
                     </div>
                     <span className="text-sm font-bold text-orange-600">Add members</span>
                   </button>

                   {(selectedContact?.members || []).map((member: any) => (
                      <div key={member.user.id} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                               <Checks size={20} weight="duotone" />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                 {member.user.name}
                                 {member.user.id === session?.user?.id && <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-black">YOU</span>}
                               </div>
                               <div className="text-[10px] font-extrabold text-slate-400 uppercase">{member.user.role}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Group</h3>
                <p className="text-sm text-slate-500 mt-1">Setup a new communication channel</p>
              </div>
              <button onClick={() => setIsCreatingGroup(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} weight="bold" className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">Group Name</label>
                <input 
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 px-1">Description (Optional)</label>
                <textarea 
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What's this group about?"
                  rows={3}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsCreatingGroup(false)}
                className="flex-1 py-4 px-6 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmCreateGroup}
                disabled={!newGroupName.trim()}
                className="flex-[2] py-4 px-6 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 hover:bg-orange-700 disabled:bg-slate-200 disabled:shadow-none transition-all"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {isAddingMembers && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] p-2">
            <div className="px-6 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Add Members</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">To {selectedContact?.name}</p>
              </div>
              <button onClick={() => setIsAddingMembers(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {allUsers.map((user) => (
                <button 
                  key={user.id}
                  onClick={() => handleAddMember(user.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-orange-50 transition-all group text-left border border-transparent hover:border-orange-100"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-orange-500 group-hover:shadow-sm transition-all">
                    <User size={24} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900">{user.name}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</div>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-orange-500 transition-all">
                    <div className="h-3 w-3 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4">
               <button 
                 onClick={() => setIsAddingMembers(false)}
                 className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-slate-800 transition-all"
               >
                 Done
               </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-in {
          animation: 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes zoom-in-95 {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
