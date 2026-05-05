"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, MagnifyingGlass, Sun, Moon, ChatCircleDots, List, X, SidebarSimple } from "@phosphor-icons/react";
import { SidebarNav } from "./sidebar-nav";
import { NotificationCenter } from "./notification-center";
import { useAuth } from "../../hooks/use-auth";
import { canAccessWebDashboard } from "../../lib/role-access";

export function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isBootstrapping, logout, session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(session?.user?.role === "parent");
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [themeTrigger, setThemeTrigger] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarWidth");
    if (saved) setSidebarWidth(parseInt(saved));
  }, []);
  
  useEffect(() => {
    if (session?.user?.role === "parent") {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [session?.user?.role]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resizeSidebar = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 450) {
        setSidebarWidth(newWidth);
        localStorage.setItem("sidebarWidth", newWidth.toString());
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resizeSidebar);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resizeSidebar);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resizeSidebar);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router]);

  useEffect(() => {
    if (isBootstrapping) return;
    if (!session) {
      router.replace("/");
      return;
    }
    if (!canAccessWebDashboard(session.user.role)) {
      logout();
      router.replace("/");
    }
  }, [isBootstrapping, logout, router, session]);

  if (isBootstrapping || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-[#F1F5F9] bg-[var(--bg-secondary)]/80 px-6 py-5 text-sm text-[var(--text-secondary)] shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          Restoring your workspace...
        </div>
      </div>
    );
  }

  return (
    <main className="mesh-bg flex h-screen bg-[var(--bg-primary)] relative overflow-hidden transition-colors duration-300">
      {/* Sidebar Overlay for Mobile */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 lg:hidden ${
        isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}>
         <div 
           className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           onClick={() => setIsSidebarOpen(false)}
         />
         <div className={`relative h-full w-[280px] bg-[var(--bg-secondary)] transition-transform duration-500 ${
           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
         }`}>
            <SidebarNav />
         </div>
      </div>

      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:block flex-shrink-0 border-r border-[var(--border)] relative group transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}
        style={{ width: isSidebarCollapsed ? '0px' : `${sidebarWidth}px` }}
      >
        <SidebarNav />
        {/* Resize Handle */}
        {!isSidebarCollapsed && (
          <div 
            className={`sidebar-resizer ${isResizing ? 'is-resizing' : ''}`}
            onMouseDown={startResizing}
          />
        )}
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 hide-scrollbar overflow-hidden relative z-10">
        <header className="sticky top-0 h-[64px] bg-[var(--bg-primary)]/70 backdrop-blur-xl border-b border-[var(--border)] px-6 lg:px-8 flex items-center justify-between z-40 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              <List size={24} />
            </button>

            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all hover:scale-105 active:scale-95 shadow-[var(--card-shadow)]"
              title={isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
            >
              <SidebarSimple size={22} weight={isSidebarCollapsed ? "bold" : "duotone"} className={isSidebarCollapsed ? "text-[var(--accent)]" : ""} />
            </button>
          </div>
          
          <div className="flex items-center gap-7">
             <div className="hidden sm:flex items-center gap-4">
                <button 
                  onClick={() => {
                    const next = theme === 'dark' ? 'light' : 'dark';
                    setTheme(next);
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('theme', next);
                  }}
                  className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
                </button>
                
                <NotificationCenter />

                <button 
                  onClick={() => router.push('/dashboard/chat')}
                  className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all" 
                  title="Messages"
                >
                  <ChatCircleDots size={24} />
                </button>
             </div>

             <div className="flex items-center gap-3.5 pl-0 sm:pl-7 sm:border-l border-[var(--border)]">
                <div className="text-right hidden xs:block">
                   <p className="text-sm font-extrabold text-[var(--text-primary)] leading-none">{session.user.name}</p>
                   <p className="text-[11px] font-bold text-[var(--accent)] mt-1.5 uppercase tracking-wider">{session.user.role}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[var(--bg-secondary)] border-2 border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} alt="avatar" />
                </div>
                <button
                  className="ml-4 rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] transition hover:bg-rose-50 hover:text-rose-600"
                  onClick={logout}
                >
                  Logout
                </button>
             </div>
          </div>
        </header>

        <section className={`flex-1 relative z-10 overflow-hidden ${pathname === '/dashboard/chat' ? 'p-0' : 'p-6 lg:p-10 overflow-y-auto hide-scrollbar'}`}>
          {children}
        </section>
      </div>
    </main>
  );
}
