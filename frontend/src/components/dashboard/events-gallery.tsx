"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShareNetwork, Globe, Bell, Megaphone, Plus, ArrowClockwise, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { getAnnouncements, deleteAnnouncement, type Announcement } from "../../services/announcements-service";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "sonner";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const TARGET_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  all:     { label: "Everyone",    color: "bg-emerald-50 text-emerald-600",  icon: <Globe     size={10} /> },
  parents: { label: "Parents",     color: "bg-blue-50 text-blue-600",        icon: <Bell      size={10} /> },
  staff:   { label: "Staff Only",  color: "bg-purple-50 text-purple-600",    icon: <Megaphone size={10} /> },
};

const FILTERS = ["All", "Parents"];

export function EventsGallery() {
  const router = useRouter();
  const { session } = useAuth();
  const isAdmin = session?.user.role === "admin" || session?.user.role === "leader";

  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements(0, 50);
      setPosts(data);
    } catch {
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteAnnouncement(id);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = filter === "All"
    ? posts
    : posts.filter((p) => {
        const lbl = TARGET_LABELS[p.target]?.label ?? "";
        return lbl === filter;
      });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Event Gallery</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{posts.length} announcements</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
            title="Refresh"
          >
            <ArrowClockwise size={16} />
          </button>
          {isAdmin && (
            <button
              onClick={() => router.push("/dashboard/notice-post")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7F50] text-white text-xs font-bold shadow-sm shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all active:scale-95"
            >
              <Plus size={13} weight="bold" />
              New Post
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === f
                ? "bg-[#FF7F50] text-white shadow-sm shadow-[#FF7F50]/30"
                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="w-28 h-3 rounded bg-slate-100" />
                  <div className="w-16 h-2.5 rounded bg-slate-100" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 rounded bg-slate-100" />
                <div className="w-full h-3 rounded bg-slate-100" />
                <div className="w-5/6 h-3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm font-medium mb-3">{error}</p>
          <button onClick={fetchPosts} className="text-[#FF7F50] text-sm font-bold hover:underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Megaphone size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium text-sm">No announcements yet</p>
          {isAdmin && (
            <button
              onClick={() => router.push("/dashboard/notice-post")}
              className="mt-4 text-[#FF7F50] text-sm font-bold hover:underline"
            >
              Create the first post →
            </button>
          )}
        </div>
      )}

      {/* Feed */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {filtered.map((post, idx) => {
            if (!post) return null;
            const targetKey = post.target || 'all';
            const tgt = TARGET_LABELS[targetKey] || TARGET_LABELS.all;
            const initials = (post.author?.name || "??").slice(0, 2).toUpperCase();

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF7F50] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{post.author.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${tgt.color}`}>
                          {tgt.icon}
                          {tgt.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => router.push(`/dashboard/notice-post?edit=${post.id}`)}
                          className="p-2 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                          title="Edit Post"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Delete Post"
                        >
                          <TrashSimple size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-2 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all">
                      <ShareNetwork size={18} />
                    </button>
                  </div>
                </div>

                {/* Image */}
                {post.imageUrl && (
                  <div className="w-full border-y border-slate-50 overflow-hidden" style={{ aspectRatio: "16/9", position: "relative" }}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="px-5 pb-5 pt-4">
                  <h3 className="text-base font-black text-slate-900 mb-2 leading-snug">{post.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-[11px] font-semibold text-slate-400 capitalize">
                    {post.author.role}
                  </span>
                  <span className="text-[11px] font-medium text-slate-300">
                    {new Date(post.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
