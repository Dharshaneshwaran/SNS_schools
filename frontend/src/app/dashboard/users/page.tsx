"use client";

import { useEffect, useState } from "react";
import { PageSection } from "../../../components/dashboard/page-section";
import { getAllUsers } from "../../../services/users-service";
import { Users, IdentificationCard, DotsThreeVertical } from "@phosphor-icons/react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <PageSection
      eyebrow="System Management"
      title="User Directory"
      description="View and manage all registered users, including admins, teachers, and student profiles."
    >
      <div className="rounded-[2rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 font-bold">User Name</th>
                <th className="px-8 py-5 font-bold">Email</th>
                <th className="px-8 py-5 font-bold">Role</th>
                <th className="px-8 py-5 font-bold">Department</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                    Retrieving directory from database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                    No users found in the system.
                  </td>
                </tr>
              ) : users.map((user, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <IdentificationCard size={20} weight="duotone" />
                      </div>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{user.department}</td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-slate-300 text-right group-hover:text-[#FF7F50] transition-colors cursor-pointer">
                    <DotsThreeVertical size={24} className="inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageSection>
  );
}
