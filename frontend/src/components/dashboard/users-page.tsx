"use client";

import { useState, useEffect } from "react";
import { 
  UserCircle, 
  PencilSimple, 
  Trash, 
  DownloadSimple,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  UsersThree,
  MapPin,
  Bus
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSection } from "./page-section";
import { getAllUsers, deleteUser } from "../../services/users-service";

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<{ type: 'delete' | 'edit' | 'view' | 'assign-bus' | null, user: any | null }>({ type: null, user: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers() as any[];
        const mapped = data.map(u => ({
          id: u.studentProfile?.studentId || u.teacherProfile?.employeeId || u.id.slice(0, 8),
          dbId: u.id,
          name: u.name,
          role: u.role === 'parent' ? 'Student' : u.role.charAt(0).toUpperCase() + u.role.slice(1),
          status: u.status === 'active' ? 'Active' : 'Inactive',
          email: u.email,
          rawUser: u,
          features: ["Transport", "Attendance", "Results", "Reports"].filter(() => Math.random() > 0.3)
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDownload = () => {
    const headers = ["ID", "Name", "Role", "Email", "Status"];
    const rows = filteredUsers.map(u => [u.id, u.name, u.role, u.email, u.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sns_users_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = async () => {
    if (!modal.user) return;
    setIsActionLoading(true);
    try {
      const success = await deleteUser(modal.user.dbId);
      if (success) {
        setUsers(users.filter(u => u.dbId !== modal.user.dbId));
        setModal({ type: null, user: null });
      } else {
        alert("Server failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const saveEdit = (newName: string) => {
    if (modal.user && newName) {
      setUsers(users.map(u => u.dbId === modal.user.dbId ? { ...u, name: newName } : u));
      setModal({ type: null, user: null });
    }
  };

  const handleDelete = (user: any) => {
    setModal({ type: 'delete', user });
  };

  const handleEdit = (user: any) => {
    setModal({ type: 'edit', user });
  };

  const toggleFeature = (userId: string, feature: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const hasFeature = u.features.includes(feature);
        return {
          ...u,
          features: hasFeature 
            ? u.features.filter((f: string) => f !== feature) 
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
      <AnimatePresence>
        {modal.type && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ type: null, user: null })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            
            {/* View Details Modal (Student Dossier) */}
            {modal.type === 'view' && modal.user?.role === 'Student' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl max-h-[90vh] bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.1)] relative overflow-hidden flex flex-col lg:flex-row z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Profile Sidebar */}
              <div className="w-full lg:w-96 bg-slate-50/80 p-8 lg:p-12 border-r border-slate-100 flex flex-col items-center text-center overflow-y-auto">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-5xl font-black italic text-[#FF7F50] mb-6 shrink-0">
                  {modal.user.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">{modal.user.name}</h3>
                <p className="px-4 py-1.5 bg-[#FF7F50]/10 text-[#FF7F50] text-xs font-bold rounded-full uppercase tracking-wider mb-8">
                  {modal.user.rawUser?.studentProfile?.admissionNo || modal.user.rawUser?.studentProfile?.studentId || "No ID"}
                </p>
                
                <div className="w-full space-y-3 text-left">
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-4 items-center shadow-sm">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7F50] flex items-center justify-center shrink-0"><UserCircle size={24} weight="duotone" /></div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Class & Section</p>
                       <p className="text-sm font-bold text-slate-900">{modal.user.rawUser?.studentProfile?.class} - {modal.user.rawUser?.studentProfile?.section}</p>
                     </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-4 items-center shadow-sm">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7F50] flex items-center justify-center shrink-0"><UserCircle size={24} weight="duotone" /></div>
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date of Birth</p>
                       <p className="text-sm font-bold text-slate-900">{modal.user.rawUser?.studentProfile?.dob || "Not Provided"}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 p-8 lg:p-12 relative overflow-y-auto bg-white flex flex-col">
                <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-100">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7F50] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF7F50]"></span> Student Dossier
                    </h4>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admission Record</h2>
                  </div>
                  <button 
                    onClick={() => setModal({ type: null, user: null })}
                    className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-20"
                  >
                    <XCircle size={24} weight="fill" />
                  </button>
                </div>

                <div className="space-y-10 flex-1">
                  {/* Previous Education */}
                  <div>
                     <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
                       <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500"><BookOpen size={16} weight="fill" /></span>
                       Previous Education
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Present School</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.presentSchool || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Previous Grade</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.previousGrade || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Board of Education</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.boardOfEducation || "N/A"}</p>
                        </div>
                     </div>
                  </div>

                  {/* Parents Details */}
                  <div>
                     <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
                       <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500"><UsersThree size={16} weight="fill" /></span>
                       Parents / Guardians
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Father */}
                        <div className="space-y-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                           <h4 className="text-[#FF7F50] font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                             Father's Details
                           </h4>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Name</p>
                              <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.fatherName || "N/A"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                              <p className="text-sm text-slate-600 font-medium">{modal.user.rawUser?.studentProfile?.fatherContact || "No Phone"} <br/> {modal.user.rawUser?.studentProfile?.fatherEmail || "No Email"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Occupation</p>
                              <p className="text-sm text-slate-600 font-medium">{modal.user.rawUser?.studentProfile?.fatherOccupation || "N/A"}</p>
                           </div>
                        </div>

                        {/* Mother */}
                        <div className="space-y-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                           <h4 className="text-[#FF7F50] font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                             Mother's Details
                           </h4>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Name</p>
                              <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.motherName || "N/A"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                              <p className="text-sm text-slate-600 font-medium">{modal.user.rawUser?.studentProfile?.motherContact || "No Phone"} <br/> {modal.user.rawUser?.studentProfile?.motherEmail || "No Email"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Occupation</p>
                              <p className="text-sm text-slate-600 font-medium">{modal.user.rawUser?.studentProfile?.motherOccupation || "N/A"}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Other Demographics */}
                  <div>
                     <h3 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
                       <span className="p-1.5 rounded-lg bg-sky-50 text-sky-500"><MapPin size={16} weight="fill" /></span>
                       Additional Info
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nationality</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.nationality || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Religion</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.religion || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Community</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.community || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mother Tongue</p>
                           <p className="text-sm text-slate-900 font-bold">{modal.user.rawUser?.studentProfile?.motherTongue || "N/A"}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
            )}

            {/* Standard Edit/Delete Modals */}
            {modal.type !== 'view' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden z-10"
            >
              {modal.type === 'delete' && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                    <Trash size={32} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Confirm Deletion</h3>
                    <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete <span className="font-bold text-slate-900">{modal.user.name}</span>? This will permanently remove all their associated records.</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setModal({ type: null, user: null })}
                      className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmDelete}
                      disabled={isActionLoading}
                      className="flex-1 px-6 py-4 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50"
                    >
                      {isActionLoading ? "Deleting..." : "Delete User"}
                    </button>
                  </div>
                </div>
              )}

              {modal.type === 'edit' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[#FF7F50]">
                    <PencilSimple size={28} weight="duotone" />
                    <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={modal.user.name}
                      onBlur={(e) => saveEdit(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit((e.target as HTMLInputElement).value)}
                      autoFocus
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#FF7F50] outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">* Changes will update the local directory view.</p>
                  <button 
                    onClick={() => setModal({ type: null, user: null })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}

              {modal.type === 'assign-bus' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sky-500">
                      <div className="p-3 bg-sky-50 rounded-2xl"><Bus size={28} weight="duotone" /></div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Assign Transport</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{modal.user.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { id: "Bus 1", route: "Downtown Express (Route A)", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", activeBg: "bg-rose-500" },
                      { id: "Bus 2", route: "Northern Suburbs (Route B)", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", activeBg: "bg-amber-500" },
                      { id: "Bus 3", route: "Eastern Campus Link (Route C)", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", activeBg: "bg-emerald-500" },
                      { id: "Bus 4", route: "West End Local (Route D)", color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100", activeBg: "bg-indigo-500" },
                    ].map(bus => {
                      const isActive = modal.user.busAssigned === bus.id;
                      return (
                        <button
                          key={bus.id}
                          onClick={() => {
                            setUsers(users.map(u => u.dbId === modal.user.dbId ? { ...u, busAssigned: bus.id } : u));
                            setModal({ type: null, user: null });
                          }}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isActive ? `border-transparent ${bus.color} ${bus.bg}` : "border-slate-100 bg-white hover:border-slate-200"}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? `${bus.activeBg} text-white shadow-lg` : `${bus.bg} ${bus.color}`}`}>
                            <Bus size={20} weight={isActive ? "fill" : "duotone"} />
                          </div>
                          <div>
                            <p className={`font-black uppercase tracking-wider text-xs ${isActive ? bus.color : "text-slate-900"}`}>{bus.id}</p>
                            <p className={`text-[10px] font-bold ${isActive ? bus.color : "text-slate-500"} opacity-80`}>{bus.route}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setModal({ type: null, user: null })}
                      className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    {modal.user.busAssigned && (
                      <button 
                        onClick={() => {
                          setUsers(users.map(u => u.dbId === modal.user.dbId ? { ...u, busAssigned: null } : u));
                          setModal({ type: null, user: null });
                        }}
                        className="px-6 py-4 rounded-2xl bg-rose-50 text-rose-500 font-bold hover:bg-rose-100 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
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
              <button 
                onClick={handleDownload}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
              >
                 <DownloadSimple size={20} />
              </button>
           </div>
        </div>

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
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 border-4 border-[#FF7F50] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-bold text-slate-400">Loading directory...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.map((user) => (
                      <tr 
                        key={user.dbId} 
                        className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                        onDoubleClick={() => {
                          if (user.role === 'Student') {
                            setModal({ type: 'view', user });
                          }
                        }}
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#FF7F50] group-hover:text-white transition-colors">
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
                               {(user.role === 'Student' 
                                 ? ["Transport", "Chat"] 
                                 : ["Reports", "Exam Grading", "Manage Timetable", "Announcements"]
                               ).map(feature => {
                                 const isActive = user.features?.includes(feature) || false;
                                 return (
                                   <button 
                                     key={feature}
                                     onClick={(e) => { e.stopPropagation(); toggleFeature(user.id, feature); }}
                                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                       isActive 
                                         ? "border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]" 
                                         : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100"
                                     }`}
                                   >
                                     {feature}
                                     {isActive ? <ToggleRight size={18} weight="fill" /> : <ToggleLeft size={18} />}
                                   </button>
                                 );
                               })}
                               {user.role === 'Student' && user.features?.includes("Transport") && (
                                 <button
                                   onClick={(e) => { e.stopPropagation(); setModal({ type: 'assign-bus', user }); }}
                                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                     user.busAssigned 
                                       ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                       : "border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100"
                                   }`}
                                 >
                                   <Bus size={18} weight="duotone" />
                                   {user.busAssigned ? `Route: ${user.busAssigned}` : "Assign Bus"}
                                 </button>
                               )}
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
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                                 className="p-2 text-slate-300 hover:text-[#FF7F50] transition-colors"
                               >
                                 <PencilSimple size={18} />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleDelete(user); }}
                                 className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                               >
                                 <Trash size={18} />
                               </button>
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
