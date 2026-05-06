"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  UserSquare, 
  TrendUp, 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  UserPlus, 
  FileText,
  ListChecks,
  DotsThreeVertical,
  MagnifyingGlass,
  Funnel,
  Bell,
  UserList,
  GraduationCap,
  Bus,
  Calendar,
  ChalkboardTeacher,
  Student,
  ChatCircleDots
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { AdminStatCard } from "./admin-stat-card";
import { EventsGallery } from "./events-gallery";
import { getAllUsers } from "../../services/users-service";
import { getDashboardOverview, DashboardOverview } from "../../services/dashboard-service";
import Link from "next/link";

interface DashboardUser {
  name: string;
  email: string;
  department: string;
  status: string;
  role: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, overviewData] = await Promise.all([
          getAllUsers(),
          getDashboardOverview()
        ]);
        
        // Filter for students (parents in current role mapping)
        const students = (usersData as DashboardUser[]).filter((u: DashboardUser) => u.role === "parent");
        setUsers(students);
        setOverview(overviewData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ... (rest of header/stats) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7F50]/10 border border-[#FF7F50]/20">
            <ShieldCheck size={24} className="text-[#FF7F50]" weight="duotone" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Admin Command Center</h1>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl">
          Welcome back, Admin. Here&apos;s a real-time snapshot of SNS Academy&apos;s operations across staff, students, and academic compliance.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard 
          label={overview?.stats[0]?.label || "Total Students"} 
          value={isLoading ? "..." : (overview?.stats[0]?.value || users.length.toString())} 
          change="+12" 
          trend="up" 
          icon={<Users size={24} />} 
        />
        <AdminStatCard 
          label={overview?.stats[1]?.label || "Active Staff"} 
          value={isLoading ? "..." : (overview?.stats[1]?.value || "0")} 
          change="+3" 
          trend="up" 
          icon={<UserSquare size={24} />} 
        />
        <AdminStatCard 
          label={overview?.stats[2]?.label || "Attendance"} 
          value={isLoading ? "..." : (overview?.stats[2]?.value || "0%")} 
          change="-0.5%" 
          trend="down" 
          icon={<CalendarCheck size={24} />} 
        />
        <AdminStatCard 
          label={overview?.stats[3]?.label || "Pending Approvals"} 
          value={isLoading ? "..." : (overview?.stats[3]?.value || "0")} 
          change="+5" 
          trend="up" 
          icon={<Clock size={24} />} 
        />
      </section>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Management & Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Quick Actions Hub */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70_rgba(15,23,42,0.05)] sm:p-10">
            <h3 className="text-lg font-semibold text-slate-900 mb-8 flex items-center gap-2">
              <ListChecks size={20} className="text-[#FF7F50]" />
              System Modules
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              <ManagementAction 
                icon={<Bell size={28} weight="duotone" />} 
                label="Notifications" 
                description="Broadcast messages"
                href="/dashboard/notifications"
              />
              <ManagementAction 
                icon={<UserList size={28} weight="duotone" />} 
                label="Attendance" 
                description="Track presence"
                href="/dashboard/attendance"
              />
              <ManagementAction 
                icon={<Users size={28} weight="duotone" />} 
                label="Users" 
                description="Manage students/staff"
                href="/dashboard/users"
              />
              <ManagementAction 
                icon={<GraduationCap size={28} weight="duotone" />} 
                label="Results" 
                description="Publish marks"
                href="/dashboard/results"
              />
              <ManagementAction 
                icon={<Bus size={28} weight="duotone" />} 
                label="Transport" 
                description="Track bus routes"
                href="/dashboard/transport"
              />
              <ManagementAction 
                icon={<Calendar size={28} weight="duotone" />} 
                label="Timetable" 
                description="Set schedules"
                href="/dashboard/timetable"
              />
              <ManagementAction 
                icon={<CalendarCheck size={28} weight="duotone" />} 
                label="Calendar" 
                description="Add school events"
                href="/dashboard/calendar"
              />
              <ManagementAction 
                icon={<UserPlus size={28} weight="duotone" />} 
                label="Admission" 
                description="New enrollment"
                href="/dashboard/admission"
              />
              <ManagementAction 
                icon={<ChalkboardTeacher size={28} weight="duotone" />} 
                label="Staff" 
                description="Faculty management"
                href="/dashboard/staff"
              />
              <ManagementAction 
                icon={<Student size={28} weight="duotone" />} 
                label="Alumni" 
                description="Past students"
                href="/dashboard/alumni"
              />
              <ManagementAction 
                icon={<FileText size={28} weight="duotone" />} 
                label="Reports" 
                description="Generate data"
                href="/dashboard/reports"
              />
              <ManagementAction 
                icon={<ChatCircleDots size={28} weight="duotone" />} 
                label="Chat" 
                description="Direct messaging"
                href="/dashboard/chat"
              />
            </div>
          </div>

          {/* Student Roster Section */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold text-slate-900">Student Roster</h3>
              <div className="flex gap-3">
                <div className="relative">
                   <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Search..." 
                     className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-[#FF7F50] outline-none transition-colors w-40"
                   />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 hover:text-slate-900 transition-colors">
                  <Funnel size={16} /> Filter
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4 font-bold">Student Name</th>
                    <th className="pb-4 font-bold">Email</th>
                    <th className="pb-4 font-bold">Department</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">Loading records from database...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">No students found. Use &quot;Admission&quot; to add one.</td>
                    </tr>
                  ) : users.map((student, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-4 text-slate-500">{student.email}</td>
                      <td className="py-4 text-slate-500">{student.department}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300 text-right group-hover:text-[#FF7F50] transition-colors cursor-pointer">
                        <DotsThreeVertical size={20} className="inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <EventsGallery />

          {/* Activity Log / Trends Mockup */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70_rgba(15,23,42,0.05)]">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-semibold text-slate-900">Attendance Trends</h3>
               <div className="flex gap-2">
                 <button className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-600">Weekly</button>
                 <button className="px-3 py-1 text-xs rounded-lg bg-[#FF7F50] text-white">Monthly</button>
               </div>
             </div>
             {/* Mock Chart Area */}
             <div className="h-64 w-full flex items-end gap-2 px-4">
                {[45, 60, 55, 80, 70, 90, 85, 95, 75, 88, 92, 98].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="flex-1 rounded-t-lg bg-[#FF7F50]/10 border-t-2 border-[#FF7F50] hover:bg-[#FF7F50]/20 transition-colors relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h}% Present
                    </div>
                  </motion.div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold px-4">
                <span>Jan</span>
                <span>Mar</span>
                <span>Jun</span>
                <span>Sep</span>
                <span>Dec</span>
             </div>
          </div>
        </div>

        {/* Right Column: Alerts & Approvals */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Approval Queue */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-8 shadow-[0_24px_70_rgba(15,23,42,0.05)] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Pending Approvals</h3>
              <span className="text-[10px] bg-[#FF7F50]/10 text-[#FF7F50] px-2 py-1 rounded-full font-bold uppercase tracking-wider">28 NEW</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <ApprovalItem 
                name="Sanjay Kumar" 
                type="Teacher Leave" 
                date="Today, 10:30 AM" 
              />
              <ApprovalItem 
                name="Deepa R." 
                type="New Student" 
                date="Today, 09:15 AM" 
              />
              <ApprovalItem 
                name="Vikram Singh" 
                type="Asset Request" 
                date="Yesterday" 
              />
            </div>

            <button className="w-full mt-2 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
              View All Requests
            </button>
          </div>

          {/* System Health */}
          <div className="rounded-[2rem] bg-gradient-to-br from-[#FF7F50]/5 to-white border border-[#FF7F50]/20 p-8 shadow-[0_24px_70_rgba(255,127,80,0.05)]">
             <div className="flex items-center gap-3 mb-6">
                <TrendUp size={24} className="text-[#FF7F50]" />
                <h3 className="text-lg font-semibold text-slate-900">System Pulse</h3>
             </div>
             <div className="flex flex-col gap-4">
                <PulseItem label="Database Sync" status="Operational" />
                <PulseItem label="Staff Portal" status="Active" />
                <PulseItem label="Notification Hub" status="Healthy" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ManagementAction({ icon, label, description, href }: { icon: React.ReactNode, label: string, description: string, href: string }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#FF7F50]/30 hover:bg-white hover:shadow-xl transition-all text-center group h-full cursor-pointer"
      >
        <div className="text-slate-400 group-hover:text-[#FF7F50] transition-colors">
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 mb-0.5">{label}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{description}</div>
        </div>
      </motion.div>
    </Link>
  );
}

function ApprovalItem({ name, type, date }: { name: string, type: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-slate-900 group-hover:text-[#FF7F50] transition-colors">{name}</span>
        <span className="text-xs text-slate-500">{type}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-slate-400 font-medium">{date}</span>
        <DotsThreeVertical size={20} className="text-slate-300" />
      </div>
    </div>
  );
}

function PulseItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#FF7F50] animate-pulse" />
        <span className="text-xs font-bold text-slate-900">{status}</span>
      </div>
    </div>
  );
}
