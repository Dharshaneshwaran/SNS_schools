"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bus, 
  MapPin, 
  Users, 
  CaretRight,
  NavigationArrow,
  CheckCircle,
  Warning,
  MagnifyingGlass,
  XCircle,
  UserCircle
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { getAllUsers } from "../../services/users-service";

const routes = [
  { id: "R-101", name: "North Zone Circuit", driver: "Somnath P.", status: "On Route", students: 42, color: "#FF7F50" },
  { id: "R-102", name: "South City Express", driver: "Karan S.", status: "On Route", students: 38, color: "#3B82F6" },
  { id: "R-103", name: "East Metro Link", driver: "Vikram R.", status: "Delayed", students: 45, color: "#F59E0B" },
  { id: "R-104", name: "West Hills Path", driver: "Deepak M.", status: "Idle", students: 32, color: "#10B981" },
];

export function TransportPage() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [showManifestModal, setShowManifestModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const openManifestModal = async () => {
    setShowManifestModal(true);
    setIsLoadingUsers(true);
    try {
      const data = await getAllUsers() as any[];
      // Filter for active students who have the transport feature toggled on
      const mapped = data.map(u => ({
        id: u.studentProfile?.studentId || u.teacherProfile?.employeeId || u.id.slice(0, 8),
        dbId: u.id,
        name: u.name,
        role: u.role === 'parent' ? 'Student' : u.role.charAt(0).toUpperCase() + u.role.slice(1),
        status: u.status === 'active' ? 'Active' : 'Inactive',
        features: ["Transport", "Attendance"].filter(() => Math.random() > 0.3), // Mock features
        busAssigned: null
      })).filter(u => u.role === 'Student' && u.features.includes("Transport"));
      setUsers(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  return (
    <PageSection
      eyebrow="Logistics & Safety"
      title="Transport Management"
      description="Monitor school bus fleet, manage student assignments, and track routes in real-time."
    >
      <AnimatePresence>
        {showManifestModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManifestModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.1)] relative overflow-hidden flex flex-col z-10"
              onClick={e => e.stopPropagation()}
            >
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#FF7F50]/10 text-[#FF7F50] rounded-2xl"><Users size={28} weight="fill" /></div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900">Route Manifest</h2>
                        <p className="text-sm font-bold text-slate-500 mt-1">Assign transport-enrolled students to buses</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setShowManifestModal(false)}
                    className="p-3 rounded-full bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-sm"
                  >
                    <XCircle size={24} weight="fill" />
                  </button>
               </div>
               
               <div className="p-8 overflow-y-auto flex-1 bg-white">
                 {isLoadingUsers ? (
                   <div className="py-20 flex flex-col items-center gap-4">
                     <div className="w-8 h-8 border-4 border-[#FF7F50] border-t-transparent rounded-full animate-spin" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing Database...</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {users.map(user => (
                       <div key={user.dbId} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                                <UserCircle size={24} weight="duotone" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <select
                               value={user.busAssigned || ""}
                               onChange={(e) => {
                                 setUsers(users.map(u => u.dbId === user.dbId ? { ...u, busAssigned: e.target.value } : u));
                               }}
                               className={`px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer border transition-all ${
                                 user.busAssigned 
                                   ? "border-[#FF7F50] bg-[#FF7F50]/10 text-[#FF7F50]" 
                                   : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                               }`}
                             >
                               <option value="">Unassigned</option>
                               {routes.map(r => (
                                 <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
                               ))}
                             </select>
                          </div>
                       </div>
                     ))}
                     {users.length === 0 && (
                        <div className="py-20 text-center space-y-4 flex flex-col items-center">
                           <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                             <Users size={40} weight="duotone" />
                           </div>
                           <div>
                             <h4 className="text-lg font-bold text-slate-900">No Students Found</h4>
                             <p className="text-slate-400 font-medium text-sm mt-1">No active students have the Transport feature enabled.</p>
                           </div>
                        </div>
                     )}
                   </div>
                 )}
               </div>
               
               {/* Modal Action Footer */}
               <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button 
                   onClick={() => setShowManifestModal(false)}
                   className="px-8 py-4 bg-[#FF7F50] hover:bg-[#FF6A00] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-[#FF7F50]/20 transition-all"
                 >
                   Save & Close
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left: Route List */}
        <div className="xl:col-span-4 space-y-6">
           <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-bold text-slate-900">Active Routes</h4>
                 <button className="text-xs font-bold text-[#FF7F50] uppercase tracking-wider hover:underline">+ Add Route</button>
              </div>
              <div className="space-y-3">
                 {routes.map((route) => (
                   <button 
                     key={route.id}
                     onClick={() => setSelectedRoute(route)}
                     className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                       selectedRoute.id === route.id ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-50 hover:border-slate-100"
                     }`}
                   >
                     <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: route.color }}>
                        <Bus size={24} weight="fill" />
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">{route.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] text-slate-400 font-bold uppercase">{route.id}</span>
                           <span className={`text-[10px] font-bold uppercase ${
                             route.status === 'On Route' ? 'text-emerald-500' : route.status === 'Delayed' ? 'text-amber-500' : 'text-slate-400'
                           }`}>• {route.status}</span>
                        </div>
                     </div>
                     <CaretRight size={16} className="text-slate-300" />
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <Warning size={24} className="text-[#FF7F50]" />
                 <h4 className="font-bold">Safety Alert</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                 Route <span className="text-white font-bold">R-103</span> is currently 15 minutes behind schedule due to traffic congestion on MG Road. Auto-notifications sent to parents.
              </p>
              <button className="w-full py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
                 Broadcast to Route
              </button>
           </div>
        </div>

        {/* Right: Live Tracking / Route Details */}
        <div className="xl:col-span-8 flex flex-col gap-8">
           
           {/* Mock Map Area */}
           <div className="rounded-[2.5rem] border border-[var(--border)] bg-slate-50 overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)] relative min-h-[400px]">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {/* Mock Map Interface */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                 <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                    <MagnifyingGlass size={20} className="text-slate-400" />
                 </div>
                 <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                    <NavigationArrow size={20} className="text-[#FF7F50]" weight="fill" />
                 </div>
              </div>

              <div className="absolute top-6 right-6 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Live Tracking Active</span>
              </div>

              {/* Animated Bus Marker */}
              <motion.div 
                animate={{ 
                  x: [100, 250, 400, 350, 200], 
                  y: [100, 150, 120, 250, 200] 
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                 <div className="relative">
                    <div className="absolute inset-0 bg-[#FF7F50] rounded-full blur-xl opacity-40 animate-pulse" />
                    <div className="relative h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#FF7F50]">
                       <Bus size={24} className="text-[#FF7F50]" weight="fill" />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded-lg whitespace-nowrap">
                       {selectedRoute.id} • {selectedRoute.driver}
                    </div>
                 </div>
              </motion.div>

              {/* Waypoints */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                 <div className="px-6 py-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 flex items-center gap-6">
                    <div className="text-center">
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Speed</div>
                       <div className="text-xl font-bold text-slate-900">42 <span className="text-sm">km/h</span></div>
                    </div>
                    <div className="h-10 w-px bg-slate-100" />
                    <div className="text-center">
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Students On Board</div>
                       <div className="text-xl font-bold text-slate-900">{selectedRoute.students}</div>
                    </div>
                    <div className="h-10 w-px bg-slate-100" />
                    <div className="text-center">
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">ETA Next Stop</div>
                       <div className="text-xl font-bold text-[#FF7F50]">4 <span className="text-sm">mins</span></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Actions Bar */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={openManifestModal} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-[#FF7F50]/30 transition-all text-center group">
                 <Users size={32} className="text-slate-300 group-hover:text-[#FF7F50] mx-auto mb-3" weight="duotone" />
                 <div className="font-bold text-slate-900">Assign Students</div>
                 <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Manage route manifest</p>
              </button>
              <button className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-[#FF7F50]/30 transition-all text-center group">
                 <MapPin size={32} className="text-slate-300 group-hover:text-[#FF7F50] mx-auto mb-3" weight="duotone" />
                 <div className="font-bold text-slate-900">Update Stops</div>
                 <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Edit pick-up points</p>
              </button>
              <button className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:border-[#FF7F50]/30 transition-all text-center group">
                 <CheckCircle size={32} className="text-slate-300 group-hover:text-[#FF7F50] mx-auto mb-3" weight="duotone" />
                 <div className="font-bold text-slate-900">Daily Log</div>
                 <p className="text-[10px] text-slate-400 uppercase tracking-tighter">View trip compliance</p>
              </button>
           </div>
        </div>

      </div>
    </PageSection>
  );
}
