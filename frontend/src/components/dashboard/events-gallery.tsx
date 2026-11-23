"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShareNetwork, Globe, Bell, Megaphone, Plus, ArrowClockwise, ImageSquare, Trash, UploadSimple, SpinnerGap } from "@phosphor-icons/react";
import { getAnnouncements, type Announcement } from "../../services/announcements-service";
import {
  listGallery,
  createGalleryImage,
  deleteGalleryImage,
  uploadGalleryFile,
  type SchoolImage,
} from "../../services/gallery-service";
import { useAuth } from "../../hooks/use-auth";

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
  const isAdmin =
    session?.user.role === "admin" ||
    session?.user.role === "leader" ||
    session?.user.role === "principal" ||
    session?.user.role === "coordinator";

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

  useEffect(() => { fetchPosts(); }, []);

  // ─── Photos tab ──────────────────────────────────────────────────
  const [tab, setTab] = useState<"notices" | "photos">("notices");
  const [images, setImages] = useState<SchoolImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const fetchImages = async () => {
    setImagesLoading(true);
    setImagesError(null);
    try {
      setImages(await listGallery());
    } catch {
      setImagesError("Failed to load photos.");
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "photos" && images.length === 0 && !imagesLoading && !imagesError) {
      void fetchImages();
    }
    // Only on entering the tab, so returning to it does not re-download.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setPhotoError(null);
    try {
      const path = await uploadGalleryFile(file);
      await createGalleryImage(path, file.name.replace(/\.[^.]+$/, ""));
      await fetchImages();
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: SchoolImage) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    setPhotoError(null);
    try {
      await deleteGalleryImage(image.id);
      setImages((prev) => prev.filter((i) => i.id !== image.id));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not remove the photo.");
    }
  };

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
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {tab === "notices"
              ? `${posts.length} announcement${posts.length === 1 ? "" : "s"}`
              : `${images.length} photo${images.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (tab === "notices" ? fetchPosts() : fetchImages())}
            className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
            title="Refresh"
          >
            <ArrowClockwise size={16} />
          </button>
          {isAdmin && tab === "notices" && (
            <button
              onClick={() => router.push("/dashboard/notice-post")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7F50] text-white text-xs font-bold shadow-sm shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all active:scale-95"
            >
              <Plus size={13} weight="bold" />
              New Post
            </button>
          )}
          {isAdmin && tab === "photos" && (
            <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7F50] text-white text-xs font-bold shadow-sm shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all active:scale-95 cursor-pointer disabled:opacity-60">
              {isUploading ? <SpinnerGap size={13} className="animate-spin" /> : <UploadSimple size={13} weight="bold" />}
              {isUploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  void handleUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
        {([
          { key: "notices", label: "Notices", icon: <Megaphone size={14} weight="bold" />, count: posts.length },
          { key: "photos", label: "Photos", icon: <ImageSquare size={14} weight="bold" />, count: images.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === t.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.icon}
            {t.label}
            <span className={`text-[10px] ${tab === t.key ? "text-[#FF7F50]" : "text-slate-300"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      {tab === "notices" && (
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
      )}

      {tab === "notices" && (
      <>
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
                  <button className="text-slate-300 hover:text-slate-600 transition-colors shrink-0 mt-0.5">
                    <ShareNetwork size={18} />
                  </button>
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
      </>
      )}

      {/* ═══════════════ PHOTOS TAB ═══════════════ */}
      {tab === "photos" && (
        <div>
          {photoError && (
            <p className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl">
              {photoError}
            </p>
          )}

          {imagesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : imagesError ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm font-medium mb-3">{imagesError}</p>
              <button onClick={fetchImages} className="text-[#FF7F50] text-sm font-bold hover:underline">
                Retry
              </button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <ImageSquare size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-sm">No photos yet</p>
              {isAdmin ? (
                <p className="text-slate-400 text-xs mt-2">
                  Use <span className="font-bold text-[#FF7F50]">Upload Photo</span> above to start the album.
                </p>
              ) : (
                <p className="text-slate-400 text-xs mt-2">Photos will appear here once leadership adds them.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, idx) => (
                <motion.figure
                  key={image.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white"
                >
                  <div className="aspect-[4/3] bg-slate-50">
                    <img
                      src={image.url}
                      alt={image.caption || "School photo"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="text-[11px] font-bold text-slate-500 truncate">
                      {image.caption || "Untitled"}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteImage(image)}
                        title="Remove photo"
                        className="shrink-0 p-1.5 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    )}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
