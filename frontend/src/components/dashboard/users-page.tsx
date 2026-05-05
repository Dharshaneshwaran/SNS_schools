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
  ToggleRight
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSection } from "./page-section";
import { getAllUsers, deleteUser } from "../../services/users-service";

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<{ type: 'delete' | 'edit' | null, user: any | null }>({ type: null, user: null });
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ type: null, user: null })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--bg-secondary)] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden border border-[var(--border)]"
            >
              {modal.type === 'delete' && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                    <Trash size={32} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Confirm Deletion</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">Are you sure you want to delete <span className="font-bold text-[var(--text-primary)]">{modal.user.name}</span>? This will permanently remove all their associated records.</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setModal({ type: null, user: null })}
                      className="flex-1 px-6 py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-secondary)] font-bold hover:bg-[var(--bg-muted)] transition-all"
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
                  <div className="flex items-center gap-4 text-[var(--accent)]">
                    <PencilSimple size={28} weight="duotone" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Edit Profile</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={modal.user.name}
                      onBlur={(e) => saveEdit(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit((e.target as HTMLInputElement).value)}
                      autoFocus
                      className="w-full px-6 py-4 bg-[var(--bg-primary)] rounded-2xl border-2 border-transparent focus:border-[var(--accent)] outline-none transition-all font-bold text-[var(--text-primary)]"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium italic">* Changes will update the local directory view.</p>
                  <button 
                    onClick={() => setModal({ type: null, user: null })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--bg-secondary)] p-4 rounded-[2rem] border border-[var(--border)] shadow-[var(--card-shadow)]">
           <div className="relative flex-1 w-full">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all text-[var(--text-primary)]"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              {["All", "Student", "Teacher"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                    filter === f ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button 
                onClick={handleDownload}
                className="p-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl hover:opacity-90 transition-all"
              >
                 <DownloadSimple size={20} />
              </button>
           </div>
        </div>

        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-[var(--card-shadow)]">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    <tr>
                       <th className="px-8 py-5">User Info</th>
                       <th className="px-8 py-5">Role</th>
                       <th className="px-8 py-5">Feature Access (Toggles)</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-bold text-[var(--text-muted)]">Loading directory...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.map((user) => (
                      <tr key={user.dbId} className="hover:bg-[var(--bg-primary)] transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)]">
                                  <UserCircle size={24} weight="duotone" />
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-[var(--text-primary)]">{user.name}</div>
                                  <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{user.id}</div>
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
                                         ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]" 
                                         : "border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
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
                               <button 
                                 onClick={() => handleEdit(user)}
                                 className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                               >
                                 <PencilSimple size={18} />
                               </button>
                               <button 
                                 onClick={() => handleDelete(user)}
                                 className="p-2 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
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
