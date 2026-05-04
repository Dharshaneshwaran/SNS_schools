"use client";

import { useState } from "react";
import { 
  UserCircle, 
  PencilSimple, 
  Trash, 
  DownloadSimple,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const initialUsers = [
  { id: "S-001", name: "Arjun Sharma", role: "Student", status: "Active", email: "arjun@sns.edu", features: ["Transport", "Attendance", "Results"] },
  { id: "T-102", name: "Dr. Sarah Connor", role: "Teacher", status: "Active", email: "sarah.c@sns.edu", features: ["Transport", "Attendance", "Results", "Reports"] },
  { id: "S-045", name: "Rohan Gupta", role: "Student", status: "Inactive", email: "rohan@sns.edu", features: ["Attendance"] },
  { id: "T-105", name: "Karan Singh", role: "Teacher", status: "Active", email: "karan.s@sns.edu", features: ["Attendance", "Reports"] },
];

export function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const toggleFeature = (userId: string, feature: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const hasFeature = u.features.includes(feature);
        return {
          ...u,
          features: hasFeature 
            ? u.features.filter(f => f !== feature) 
            : [...u.features, feature]
        };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || u.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageSection
      eyebrow="Identity Management"
      title="User Directory & Access"
      description="Manage student and staff accounts, edit profiles, and toggle feature permissions for individual users."
    >
      <div className="flex flex-col gap-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="relative flex-1 w-full">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              {["All", "Student", "Teacher"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? "bg-[#FF7F50] text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all">
                 <DownloadSimple size={20} />
              </button>
           </div>
        </div>

        {/* Users Table */}
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                       <th className="px-8 py-5">User Info</th>
                       <th className="px-8 py-5">Role</th>
                       <th className="px-8 py-5">Feature Access (Toggles)</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                  <UserCircle size={24} weight="duotone" />
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase">{user.id}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user.role === 'Student' ? 'bg-sky-50 text-sky-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                               {user.role}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2">
                               {["Transport", "Attendance", "Results", "Reports"].map(feature => {
                                 const isTeacherOnly = feature === "Reports";
                                 if (user.role === "Student" && isTeacherOnly) return null;
                                 
                                 const isActive = user.features.includes(feature);
                                 return (
                                   <button 
                                     key={feature}
                                     onClick={() => toggleFeature(user.id, feature)}
                                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                       isActive 
                                         ? "border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]" 
                                         : "border-slate-100 bg-slate-50 text-slate-400"
                                     }`}
                                   >
                                     {feature}
                                     {isActive ? <ToggleRight size={18} weight="fill" /> : <ToggleLeft size={18} />}
                                   </button>
                                 );
                               })}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               {user.status === 'Active' ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}
                               <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {user.status}
                               </span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-slate-300 hover:text-[#FF7F50] transition-colors"><PencilSimple size={18} /></button>
                               <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash size={18} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </PageSection>
  );
}
