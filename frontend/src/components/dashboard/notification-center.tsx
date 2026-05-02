"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Checks, ChatCircle, Info, WarningCircle, Trash } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";
import { notificationService, type AppNotification } from "../../services/notification-service";
import { useRouter } from "next/navigation";

export function NotificationCenter() {
  const { session } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!session?.accessToken) return;
    try {
      const data = await notificationService.getNotifications(session.accessToken);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [session?.accessToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      await notificationService.markAsRead(session.accessToken, id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!session?.accessToken) return;
    try {
      await notificationService.markAllAsRead(session.accessToken);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = (n: AppNotification) => {
    handleMarkAsRead(n.id);
    if (n.type === 'message') {
      router.push('/dashboard/chat');
    }
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <ChatCircle size={20} weight="fill" className="text-emerald-500" />;
      case 'alert': return <WarningCircle size={20} weight="fill" className="text-rose-500" />;
      default: return <Info size={20} weight="fill" className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl border transition-all relative ${
          isOpen ? 'bg-orange-50 border-orange-200 text-[#FF7F50]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Bell size={22} weight={unreadCount > 0 ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#FF7F50] border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] border border-slate-100 z-[100] overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-black text-[#FF7F50] uppercase tracking-tighter hover:underline flex items-center gap-1"
              >
                <Checks size={14} weight="bold" />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <Bell size={24} weight="duotone" className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 flex gap-4 relative ${!n.isRead ? 'bg-orange-50/20' : ''}`}
                >
                  {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF7F50]" />}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'message' ? 'bg-emerald-50' : n.type === 'alert' ? 'bg-rose-50' : 'bg-blue-50'
                  }`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-tight mb-1 truncate ${!n.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{n.title}</p>
                    <p className="text-[12px] text-slate-500 line-clamp-2 leading-snug">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tighter">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF7F50] transition-colors">
               View All Activity
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
