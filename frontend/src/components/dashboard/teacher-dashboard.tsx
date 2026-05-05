"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  GraduationCap, 
  ChatCircleDots,
  Bell,
  ChalkboardTeacher,
  BookOpen,
  UserCircle,
  Calendar,
  ArrowsLeftRight,
  Cake,
  Megaphone,
  Plus
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import Link from "next/link";

export function TeacherDashboard() {
  return (
    <div className="space-y-8 pb-10">
      
      {/* ── Welcome & Feed Section ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Personalized Welcome & Daily Updates */}
        <div className="lg:col-span-8 space-y-8">
           <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-4xl font-bold mb-4">Good Morning, Teacher!</h2>
                 <p className="text-[var(--text-muted)] max-w-md leading-relaxed">
                    Here's what's happening at SNS Academy today. You have 4 classes and 1 substitution period pending.
                 </p>
                 <div className="mt-8 flex gap-4">
                    <button className="px-6 py-3 bg-[var(--accent)] rounded-2xl font-bold text-sm shadow-lg shadow-[var(--accent)]/20 hover:bg-[#e66a3e] transition-all">
                       Mark Attendance
                    </button>
                    <button className="px-6 py-3 bg-[var(--bg-secondary)]/10 rounded-2xl font-bold text-sm hover:bg-[var(--bg-secondary)]/20 transition-all">
                       View My Schedule
                    </button>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full blur-[120px] opacity-20 -mr-20 -mt-20" />
           </div>

           {/* Daily Feed / Posts */}
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                 <Megaphone size={24} className="text-[var(--accent)]" weight="duotone" />
                 School Feed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FeedCard 
                   title="Annual Day Preparation" 
                   desc="Please ensure all students have submitted their consent forms by Friday."
                   time="2h ago"
                   category="Update"
                 />
                 <FeedCard 
                   title="Lab Equipment Upgrade" 
                   desc="New physics lab kits have arrived. Department heads can collect them tomorrow."
                   time="5h ago"
                   category="Announcement"
                 />
              </div>
           </div>
        </div>

        {/* Right: Birthdays & Quick Reminders */}
        <div className="lg:col-span-4 space-y-8">
           {/* Birthdays Section */}
           <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                 <Cake size={24} className="text-[var(--accent)]" weight="duotone" />
                 Today's Birthdays
              </h3>
              <div className="space-y-4">
                 <BirthdayItem name="Arjun Sharma" role="Student" grade="10-A" />
                 <BirthdayItem name="Ms. Deepa R." role="Staff" grade="Science Dept" />
                 <BirthdayItem name="Sneha Reddy" role="Student" grade="8-C" />
              </div>
              <button className="w-full mt-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--accent)] transition-colors">
                 View Full Calendar
              </button>
           </div>

           {/* Upcoming Class */}
           <div className="rounded-[2rem] bg-emerald-50 border border-emerald-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                 <Clock size={24} className="text-emerald-500" />
                 <h4 className="font-bold text-emerald-900">Next Class</h4>
              </div>
              <div className="text-2xl font-bold text-emerald-950 mb-1">Mathematics</div>
              <p className="text-emerald-700/70 text-sm font-medium mb-6">Grade 10-A • 11:30 AM - 12:15 PM</p>
              <button className="w-full py-3 bg-[var(--bg-secondary)] text-emerald-600 rounded-xl font-bold text-xs shadow-[var(--card-shadow)] hover:shadow-md transition-all">
                 Prepare Materials
              </button>
           </div>
        </div>
      </section>

      {/* ── Teacher System Modules ── */}
      <section className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)]/95 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)] sm:p-10">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
           <ChalkboardTeacher size={24} className="text-[var(--accent)]" weight="duotone" />
           Teacher Toolkit
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          <ModuleIcon href="/dashboard/profile" icon={<UserCircle size={28} weight="duotone" />} label="Profile" />
          <ModuleIcon href="/dashboard/notifications" icon={<Bell size={28} weight="duotone" />} label="Inbox" />
          <ModuleIcon href="/dashboard/attendance" icon={<CalendarCheck size={28} weight="duotone" />} label="Attendance" />
          <ModuleIcon href="/dashboard/timetable" icon={<Calendar size={28} weight="duotone" />} label="Timetable" />
          <ModuleIcon href="/dashboard/substitution" icon={<ArrowsLeftRight size={28} weight="duotone" />} label="Substitute" />
          <ModuleIcon href="/dashboard/chat" icon={<ChatCircleDots size={28} weight="duotone" />} label="Homework" />
          <ModuleIcon href="/dashboard/results" icon={<GraduationCap size={28} weight="duotone" />} label="Marks" />
          <ModuleIcon href="/dashboard/reports" icon={<BookOpen size={28} weight="duotone" />} label="Reports" />
        </div>
      </section>

      {/* ── Active Tasks & Substitutions ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-[var(--text-primary)]">Current Assignments</h3>
               <button className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">+ Add Task</button>
            </div>
            <div className="space-y-3">
               <TaskItem title="Upload Term 1 Math Marks" due="Today" status="Pending" />
               <TaskItem title="Prepare Science Lab Manual" due="Tomorrow" status="In Progress" />
               <TaskItem title="Parent Call - Rohan (Grade 10)" due="June 02" status="Scheduled" />
            </div>
         </div>

         <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-[var(--text-primary)]">Substitution Requests</h3>
               <Link href="/dashboard/substitution" className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Manage All</Link>
            </div>
            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                  <div>
                     <div className="text-sm font-bold text-amber-900">Period 5 (Grade 9-B)</div>
                     <p className="text-xs text-amber-700">Request from Mr. Vikram R.</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-bold">Accept</button>
                     <button className="px-4 py-2 bg-[var(--bg-secondary)] text-amber-600 border border-amber-200 rounded-xl text-[10px] font-bold">Decline</button>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}

function FeedCard({ title, desc, time, category }: { title: string, desc: string, time: string, category: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] hover:shadow-2xl hover:border-[var(--accent)]/30 transition-all group">
       <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-[var(--bg-primary)] text-[var(--text-muted)] rounded-full text-[8px] font-bold uppercase tracking-widest">{category}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">{time}</span>
       </div>
       <h4 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">{title}</h4>
       <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  );
}

function BirthdayItem({ name, role, grade }: { name: string, role: string, grade: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-primary)] transition-colors">
       <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
             <Cake size={20} weight="fill" />
          </div>
          <div>
             <div className="text-sm font-bold text-[var(--text-primary)]">{name}</div>
             <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{role} • {grade}</div>
          </div>
       </div>
       <button className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">Wish Now</button>
    </div>
  );
}

function ModuleIcon({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href}>
      <button className="w-full flex flex-col items-center gap-3 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--bg-secondary)] hover:shadow-2xl transition-all group">
        <div className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tighter">{label}</span>
      </button>
    </Link>
  );
}

function TaskItem({ title, due, status }: { title: string, due: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-[var(--border)] transition-all cursor-pointer">
       <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{title}</span>
       </div>
       <div className="text-right">
          <div className="text-[10px] font-bold text-[var(--text-primary)]">Due {due}</div>
          <div className="text-[8px] font-bold text-[var(--accent)] uppercase tracking-widest">{status}</div>
       </div>
    </div>
  );
}
