"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, SpinnerGap, CheckCircle, XCircle, ShieldCheck,
  Users, Folders, Plus, PencilSimple, Trash, CaretDown,
  UserList, ChalkboardTeacher, UserPlus, CurrencyCircleDollar,
  Calendar, Megaphone, FileText, GraduationCap,
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { apiRequest } from "../../services/api-client";
import { useAuth } from "../../hooks/use-auth";

type Role = "parent" | "teacher" | "leader" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: string;
  roleGroupId?: string | null;
}

interface RoleGroup {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
  users: { id: string; name: string; email: string; role: string }[];
}

const ROLES: { value: Role; label: string; color: string; bg: string }[] = [
  { value: "parent",     label: "Parent",     color: "#64748b", bg: "#F1F5F9" },
  { value: "teacher",    label: "Teacher",    color: "#3B82F6", bg: "#EFF6FF" },
  { value: "leader",     label: "Leader",     color: "#8B5CF6", bg: "#F5F3FF" },
  { value: "admin",      label: "Admin",      color: "#FF7F50", bg: "#FFF4EE" },
];

const PAGES: { key: string; label: string; sub: string; icon: React.ReactNode }[] = [
  { key: "users",      label: "Users",      sub: "Directory Search",  icon: <UserList size={28} weight="duotone" /> },
  { key: "staff",      label: "Staff",      sub: "Colleague Info",    icon: <ChalkboardTeacher size={28} weight="duotone" /> },
  { key: "admission",  label: "Admission",  sub: "Process Logs",      icon: <UserPlus size={28} weight="duotone" /> },
  { key: "finance",    label: "Finance",    sub: "Fee Status",        icon: <CurrencyCircleDollar size={28} weight="duotone" /> },
  { key: "timetable",  label: "Timetable",  sub: "Master Schedules",  icon: <Calendar size={28} weight="duotone" /> },
  { key: "broadcast",  label: "Broadcast",  sub: "Push Alerts",       icon: <Megaphone size={28} weight="duotone" /> },
  { key: "reports",    label: "Reports",    sub: "Academic Data",     icon: <FileText size={28} weight="duotone" /> },
  { key: "exams",      label: "Exams",      sub: "Marks & Control",   icon: <GraduationCap size={28} weight="duotone" /> },
];

const roleStyle = (r: Role) => ROLES.find((x) => x.value === r) ?? ROLES[0];

const emptyPermissions = (): Record<string, boolean> =>
  Object.fromEntries(PAGES.map((p) => [p.key, false]));

export function RoleManagementPage() {
  const { session } = useAuth();
  const [tab, setTab] = useState<"users" | "groups">("groups");

  /* ── Users state ── */
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [assigningGroupId, setAssigningGroupId] = useState<string | null>(null);

  /* ── Groups state ── */
  const [groups, setGroups] = useState<RoleGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<RoleGroup | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupPerms, setGroupPerms] = useState<Record<string, boolean>>(emptyPermissions());
  const [savingGroup, setSavingGroup] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  /* ── Toast ── */
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Load users ── */
  const loadUsers = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const data = await apiRequest<User[]>("/users", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setUsers(data);
    } catch { showToast("Failed to load users.", false); }
    finally { setLoading(false); }
  };

  /* ── Load groups ── */
  const loadGroups = async () => {
    if (!session?.accessToken) return;
    setGroupsLoading(true);
    try {
      const data = await apiRequest<RoleGroup[]>("/role-groups", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setGroups(data);
    } catch { showToast("Failed to load groups.", false); }
    finally { setGroupsLoading(false); }
  };

  useEffect(() => {
    loadUsers();
    loadGroups();
  }, [session?.accessToken]);

  /* ── Role change ── */
  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (!session?.accessToken) return;
    setUpdatingId(userId);
    try {
      await apiRequest(`/users/${userId}/role`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      showToast("Role updated successfully.", true);
    } catch { showToast("Failed to update role.", false); }
    finally { setUpdatingId(null); }
  };

  /* ── Group assignment ── */
  const handleAssignGroup = async (userId: string, roleGroupId: string | null) => {
    if (!session?.accessToken) return;
    setAssigningGroupId(userId);
    try {
      await apiRequest(`/role-groups/${userId}/assign`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ roleGroupId }),
      });
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, roleGroupId } : u)
      );
      showToast("Group assigned.", true);
    } catch { showToast("Failed to assign group.", false); }
    finally { setAssigningGroupId(null); }
  };

  /* ── Save group (create/edit) ── */
  const handleSaveGroup = async () => {
    if (!session?.accessToken || !groupName.trim()) return;
    setSavingGroup(true);
    try {
      if (editingGroup) {
        const updated = await apiRequest<RoleGroup>(`/role-groups/${editingGroup.id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify({ name: groupName.trim(), permissions: groupPerms }),
        });
        setGroups((prev) => prev.map((g) => g.id === editingGroup.id ? { ...g, ...updated } : g));
        showToast("Group updated.", true);
      } else {
        const created = await apiRequest<RoleGroup>("/role-groups", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify({ name: groupName.trim(), permissions: groupPerms }),
        });
        setGroups((prev) => [...prev, created]);
        showToast("Group created.", true);
      }
      resetGroupForm();
    } catch { showToast("Failed to save group.", false); }
    finally { setSavingGroup(false); }
  };

  /* ── Delete group ── */
  const handleDeleteGroup = async (id: string) => {
    if (!session?.accessToken) return;
    setDeletingGroupId(id);
    try {
      await apiRequest(`/role-groups/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setGroups((prev) => prev.filter((g) => g.id !== id));
      setUsers((prev) => prev.map((u) => u.roleGroupId === id ? { ...u, roleGroupId: null } : u));
      showToast("Group deleted.", true);
    } catch { showToast("Failed to delete group.", false); }
    finally { setDeletingGroupId(null); }
  };

  const openEditGroup = (g: RoleGroup) => {
    setEditingGroup(g);
    setGroupName(g.name);
    setGroupPerms({ ...emptyPermissions(), ...g.permissions });
    setShowGroupForm(true);
  };

  const resetGroupForm = () => {
    setShowGroupForm(false);
    setEditingGroup(null);
    setGroupName("");
    setGroupPerms(emptyPermissions());
  };

  /* ── Filtering ── */
  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.map((r) => ({ ...r, count: users.filter((u) => u.role === r.value).length }));

  return (
    <PageSection
      eyebrow="System Security"
      title="Role Management"
      description="Assign roles and manage permission groups. Changes take effect on next login."
    >
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-bold shadow-2xl"
          style={{ background: toast.ok ? "#10B981" : "#EF4444" }}
        >
          {toast.ok ? <CheckCircle size={18} weight="fill" /> : <XCircle size={18} weight="fill" />}
          {toast.msg}
        </motion.div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8">
        {([
          { key: "groups", label: "Role Groups",   icon: <Folders size={16} weight="duotone" /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === t.key
                ? "bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════ USERS TAB ══════════════ */}
        {tab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Role summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {roleCounts.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setFilterRole(filterRole === r.value ? "all" : r.value)}
                  className={`rounded-2xl p-4 border-2 text-left transition-all ${
                    filterRole === r.value ? "border-[#FF7F50] shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <p className="text-2xl font-black" style={{ color: r.color }}>{r.count}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{r.label}</p>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:border-[#FF7F50] focus:ring-2 focus:ring-[#FF7F50]/10 transition-all"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><SpinnerGap size={40} className="animate-spin text-[#FF7F50]" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
                <ShieldCheck size={56} weight="duotone" className="opacity-20" />
                <p className="font-bold">No users found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">User</th>
                        <th className="text-left px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hidden md:table-cell">Department</th>
                        <th className="text-left px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Current Role</th>
                        <th className="text-left px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Role Group</th>
                        <th className="text-left px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Change Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user, i) => {
                        const style = roleStyle(user.role);
                        const isUpdating = updatingId === user.id;
                        const isAssigning = assigningGroupId === user.id;
                        const assignedGroup = groups.find((g) => g.id === user.roleGroupId);
                        return (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                  <p className="text-xs text-slate-400">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <span className="text-sm font-medium text-slate-600">{user.department}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider" style={{ background: style.bg, color: style.color }}>
                                {style.label}
                              </span>
                            </td>
                            {/* Group assignment dropdown */}
                            <td className="px-6 py-4">
                              {isAssigning ? (
                                <SpinnerGap size={18} className="animate-spin text-[#FF7F50]" />
                              ) : (
                                <div className="relative">
                                  <select
                                    value={user.roleGroupId ?? ""}
                                    onChange={(e) => handleAssignGroup(user.id, e.target.value || null)}
                                    className="appearance-none pr-8 pl-3 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#FF7F50] transition-all cursor-pointer hover:border-slate-300"
                                  >
                                    <option value="">-- Assign Role Group --</option>
                                    {groups.map((g) => (
                                      <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                  </select>
                                  <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                              )}
                            </td>
                            {/* Role change buttons */}
                            <td className="px-6 py-4">
                              {isUpdating ? (
                                <SpinnerGap size={20} className="animate-spin text-[#FF7F50]" />
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {ROLES.filter((r) => r.value !== user.role).map((r) => (
                                    <button
                                      key={r.value}
                                      onClick={() => handleRoleChange(user.id, r.value)}
                                      className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all hover:scale-105 active:scale-95"
                                      style={{ borderColor: r.color, color: r.color, background: "transparent" }}
                                      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = r.bg; }}
                                      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                                    >
                                      {r.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════ GROUPS TAB ══════════════ */}
        {tab === "groups" && (
          <motion.div key="groups" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-extrabold text-slate-900 text-lg">Permission Groups</p>
                <p className="text-sm text-slate-400 mt-0.5">Create groups and control which pages each group can access.</p>
              </div>
              {!showGroupForm && (
                <button
                  onClick={() => { resetGroupForm(); setShowGroupForm(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7F50] text-white text-sm font-black shadow-lg shadow-[#FF7F50]/25 hover:bg-[#e66a3e] transition-all active:scale-95"
                >
                  <Plus size={16} weight="bold" /> Create Group
                </button>
              )}
            </div>

            {/* Create / Edit form */}
            <AnimatePresence>
              {showGroupForm && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)] p-6 md:p-8 mb-6"
                >
                  <p className="text-base font-extrabold text-slate-900 mb-5">
                    {editingGroup ? "Edit Group" : "New Role Group"}
                  </p>

                  {/* Group name */}
                  <div className="mb-6">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">Group Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Faculty"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full max-w-sm px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:border-[#FF7F50] focus:ring-2 focus:ring-[#FF7F50]/10 transition-all"
                    />
                  </div>

                  {/* Permission grid */}
                  <div className="mb-6">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 block">Page Access</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PAGES.map((page) => {
                        const on = !!groupPerms[page.key];
                        return (
                          <button
                            key={page.key}
                            type="button"
                            onClick={() => setGroupPerms((prev) => ({ ...prev, [page.key]: !prev[page.key] }))}
                            className={`rounded-2xl p-4 border-2 text-left transition-all ${
                              on
                                ? "border-[#FF7F50] bg-[#FFF4EE]"
                                : "border-slate-100 bg-white hover:border-slate-200"
                            }`}
                          >
                            <div className={`mb-3 transition-colors ${on ? "text-[#FF7F50]" : "text-slate-300"}`}>
                              {page.icon}
                            </div>
                            <p className={`text-sm font-extrabold transition-colors ${on ? "text-slate-900" : "text-slate-400"}`}>
                              {page.label}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                              {page.sub}
                            </p>
                            {/* Toggle pill */}
                            <div className="mt-3 flex items-center gap-2">
                              <div className={`relative w-10 h-5 rounded-full transition-all duration-300 ${on ? "bg-[#FF7F50]" : "bg-slate-200"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${on ? "left-5" : "left-0.5"}`} />
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-wider ${on ? "text-[#FF7F50]" : "text-slate-400"}`}>
                                {on ? "On" : "Off"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveGroup}
                      disabled={savingGroup || !groupName.trim()}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7F50] hover:bg-[#e66a3e] text-white font-bold text-sm transition-all disabled:opacity-50 active:scale-95"
                    >
                      {savingGroup ? <SpinnerGap size={16} className="animate-spin" /> : <CheckCircle size={16} weight="bold" />}
                      {editingGroup ? "Update Group" : "Save Group"}
                    </button>
                    <button
                      onClick={resetGroupForm}
                      className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Groups list */}
            {groupsLoading ? (
              <div className="flex justify-center py-20"><SpinnerGap size={40} className="animate-spin text-[#FF7F50]" /></div>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-slate-400 gap-3">
                <Folders size={56} weight="duotone" className="opacity-20" />
                <p className="font-bold">No groups yet. Create one above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group, i) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-lg font-extrabold text-slate-900">{group.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {group.users?.length ?? 0} member{(group.users?.length ?? 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditGroup(group)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-black uppercase hover:border-[#FF7F50] hover:text-[#FF7F50] transition-all"
                        >
                          <PencilSimple size={14} weight="bold" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          disabled={deletingGroupId === group.id}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-100 text-red-400 text-xs font-black uppercase hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
                        >
                          {deletingGroupId === group.id
                            ? <SpinnerGap size={14} className="animate-spin" />
                            : <Trash size={14} weight="bold" />}
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Permission chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PAGES.map((page) => {
                        const on = !!group.permissions?.[page.key];
                        return (
                          <div
                            key={page.key}
                            className={`rounded-2xl px-3 py-2.5 flex items-center gap-2 border ${
                              on ? "border-[#FF7F50]/30 bg-[#FFF4EE]" : "border-slate-100 bg-slate-50"
                            }`}
                          >
                            <span className={on ? "text-[#FF7F50]" : "text-slate-300"}>
                              {/* inline small icon */}
                              {page.key === "users"     && <UserList size={16} weight="duotone" />}
                              {page.key === "staff"     && <ChalkboardTeacher size={16} weight="duotone" />}
                              {page.key === "admission" && <UserPlus size={16} weight="duotone" />}
                              {page.key === "finance"   && <CurrencyCircleDollar size={16} weight="duotone" />}
                              {page.key === "timetable" && <Calendar size={16} weight="duotone" />}
                              {page.key === "broadcast" && <Megaphone size={16} weight="duotone" />}
                              {page.key === "reports"   && <FileText size={16} weight="duotone" />}
                              {page.key === "exams"     && <GraduationCap size={16} weight="duotone" />}
                            </span>
                            <div>
                              <p className={`text-[11px] font-black ${on ? "text-slate-800" : "text-slate-400"}`}>{page.label}</p>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{page.sub}</p>
                            </div>
                            {/* Mini toggle indicator */}
                            <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${on ? "bg-[#FF7F50]" : "bg-slate-200"}`} />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageSection>
  );
}
