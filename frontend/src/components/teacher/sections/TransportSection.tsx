"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bus, MapPin, Clock, Phone, User, Navigation } from "lucide-react";

const busInfo = {
  routeNo: "Route 7B",
  stops: ["SNS Academy", "Saibaba Colony", "Gandhipuram", "RS Puram", "Peelamedu"],
  pickup: "7:45 AM",
  drop: "4:30 PM",
  driver: { name: "Ramesh Kumar", phone: "+91 94440 12345", license: "TN 33 AB 5678" },
  busNo: "TN 33 Z 9901",
};

export default function TransportSection() {
  return (
    <div className="space-y-8">


      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Route Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 p-8 rounded-[48px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[var(--accent-glow)] text-[var(--accent)] flex items-center justify-center">
                <Bus size={32} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-2xl font-black italic text-[var(--text-primary)] uppercase tracking-tight">{busInfo.routeNo}</p>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1">Bus ID: {busInfo.busNo}</p>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { label: "Pickup", time: busInfo.pickup, color: "orange" },
                { label: "Drop", time: busInfo.drop, color: "blue" },
              ].map((t, i) => (
                <div key={i} className="px-6 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t.label}</p>
                  <p className="text-lg font-black text-[var(--text-primary)]">{t.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-8">Route Progress</h4>
            <div className="space-y-0 relative pl-8">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-gradient-to-b from-[var(--accent)] via-[var(--border)] to-green-500 rounded-full" />
              
              {busInfo.stops.map((stop, i) => (
                <div key={i} className="relative pb-10 last:pb-0">
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-4 border-[var(--bg-secondary)] shadow-lg ${
                    i === 0 ? "bg-[var(--accent)]" : i === busInfo.stops.length - 1 ? "bg-green-500" : "bg-[var(--border)]"
                  }`} />
                  <div className="flex flex-col">
                    <span className={`text-base font-black ${
                      i === 0 ? "text-[var(--accent)]" : i === busInfo.stops.length - 1 ? "text-green-500" : "text-[var(--text-primary)]"
                    }`}>
                      {stop}
                      {i === 0 && <span className="ml-3 text-[10px] uppercase font-bold italic tracking-widest opacity-60">(Start Point)</span>}
                      {i === busInfo.stops.length - 1 && <span className="ml-3 text-[10px] uppercase font-bold italic tracking-widest opacity-60">(School)</span>}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-secondary)] mt-1">Scheduled Stop</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-20" />
        </motion.div>

        {/* Driver & Tracking */}
        <div className="space-y-8">
          {/* Driver Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]"
          >
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight mb-6">Staff in Charge</h4>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-white flex items-center justify-center text-2xl font-black italic shadow-2xl">
                {busInfo.driver.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-black text-[var(--text-primary)] tracking-tight">{busInfo.driver.name}</p>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">Licensed Driver</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Contact", value: busInfo.driver.phone, icon: Phone },
                { label: "License No", value: busInfo.driver.license, icon: User },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] text-[var(--accent)] flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tracking Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[40px] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] shadow-[var(--card-shadow)] flex flex-col items-center justify-center text-center gap-4 group cursor-pointer overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Navigation size={32} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">Live Tracking</p>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-1 uppercase tracking-widest">Available in Transit</p>
            </div>
            
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
