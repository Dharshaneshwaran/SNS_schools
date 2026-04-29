"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Folder, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  MoreVertical, 
  Plus,
  ArrowUpCircle,
  Clock
} from "lucide-react";

const resources = [
  { name: "Algebra Basics.pdf", size: "2.4 MB", type: "pdf", date: "2h ago" },
  { name: "Force & Motion.mp4", size: "45 MB", type: "video", date: "Yesterday" },
  { name: "Chemistry Lab.jpg", size: "1.2 MB", type: "image", date: "Apr 25" },
  { name: "Midterm Syllabus.docx", size: "850 KB", type: "doc", date: "Apr 20" },
];

export default function LearningResources() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Learning Resources</h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage your course materials and gallery</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all">
            <Folder size={20} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all">
            <ArrowUpCircle size={18} /> Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {resources.map((res, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-4 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${
                res.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                res.type === 'video' ? 'bg-purple-500/10 text-purple-500' :
                res.type === 'image' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {res.type === 'pdf' && <FileText size={20} />}
                {res.type === 'video' && <Video size={20} />}
                {res.type === 'image' && <ImageIcon size={20} />}
                {res.type === 'doc' && <FileText size={20} />}
              </div>
              <button className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <h4 className="text-xs font-bold text-[var(--text-primary)] truncate mb-1">{res.name}</h4>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
              <span>{res.size}</span>
              <div className="flex items-center gap-1">
                <Clock size={10} />
                <span>{res.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add New Placeholder */}
        <motion.div
          whileHover={{ scale: 0.98 }}
          className="p-4 rounded-[24px] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
        >
          <div className="p-2 rounded-full bg-[var(--bg-primary)] group-hover:bg-[var(--accent-glow)] group-hover:text-[var(--accent)] transition-all">
            <Plus size={24} className="text-[var(--text-secondary)]" />
          </div>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">Add Resource</span>
        </motion.div>
      </div>
    </div>
  );
}
