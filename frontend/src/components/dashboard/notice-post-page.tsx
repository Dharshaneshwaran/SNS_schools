"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaperPlaneTilt,
  Image as ImageIcon,
  X,
  Megaphone,
  Bell,
  Globe,
  SpinnerGap,
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { toast } from "sonner";
import { createAnnouncement, getAnnouncementById, updateAnnouncement } from "../../services/announcements-service";
import { uploadFile } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function NoticePostPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState<"all" | "parents" | "staff">("all");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      const fetchPost = async () => {
        try {
          const post = await getAnnouncementById(editId);
          setTitle(post.title);
          setContent(post.content);
          setTarget(post.target);
          if (post.imageUrl) {
            setImagePreview(post.imageUrl);
          }
        } catch (err) {
          toast.error("Failed to fetch post for editing");
        }
      };
      fetchPost();
    }
  }, [editId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both title and content");
      return;
    }

    let imageUrl: string | undefined;

    if (imageFile) {
      setIsUploading(true);
      try {
        imageUrl = await uploadFile(imageFile, "announcements");
      } catch (err) {
        toast.error("Image upload failed. Please try again.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    setIsPosting(true);
    try {
      if (editId) {
        await updateAnnouncement(editId, {
          title: title.trim(),
          content: content.trim(),
          target,
          ...(imageUrl ? { imageUrl } : {}),
        });
        toast.success("Notice updated successfully!");
      } else {
        await createAnnouncement({
          title: title.trim(),
          content: content.trim(),
          target,
          ...(imageUrl ? { imageUrl } : {}),
        });
        toast.success("Notice posted successfully!");
      }
      router.push("/dashboard/events-gallery");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to save announcement";
      toast.error(errorMsg);
    } finally {
      setIsPosting(false);
    }
  };

  const busy = isUploading || isPosting;

  return (
    <PageSection
      eyebrow="School Bulletin"
      title="Create New Post"
      description="Publish official announcements, event updates, and news stories with rich media to the school community."
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Post Editor */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8">

              {/* Title */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Announcement Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Cultural Festival 2026"
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-[#FF7F50]/10 focus:border-[#FF7F50] outline-none transition-all font-black text-xl placeholder:text-slate-300"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Content Detail
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement details here..."
                  className="w-full h-64 px-8 py-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-2 focus:ring-[#FF7F50]/10 focus:border-[#FF7F50] outline-none transition-all resize-none leading-relaxed text-slate-700 font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Media */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Media Attachments
                </label>

                {/* Hidden file input */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {imagePreview ? (
                  /* Preview with remove button */
                  <div className="relative w-full rounded-3xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-72 object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <SpinnerGap size={36} className="text-white animate-spin" />
                        <span className="ml-3 text-white font-bold text-sm">Uploading…</span>
                      </div>
                    )}
                    <button
                      onClick={removeImage}
                      disabled={busy}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all disabled:opacity-50"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ) : (
                  /* Upload button */
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="h-32 w-40 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#FF7F50]/40 hover:text-[#FF7F50] transition-all group"
                  >
                    <ImageIcon size={28} weight="duotone" className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Image</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Publishing Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe size={18} weight="fill" className="text-[#FF7F50]" />
                Publish Settings
              </h4>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</p>
                {[
                  { id: "all",     label: "Global",  desc: "Everyone",     icon: <Globe     size={20} /> },
                  { id: "parents", label: "Parents", desc: "Parent Portal", icon: <Bell      size={20} /> },
                  { id: "staff",   label: "Faculty", desc: "Staff Only",    icon: <Megaphone size={20} /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTarget(t.id as "all" | "parents" | "staff")}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      target === t.id
                        ? "border-[#FF7F50] bg-[#FF7F50]/5"
                        : "border-slate-50 hover:border-slate-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      target === t.id ? "bg-[#FF7F50] text-white" : "bg-slate-50 text-slate-400"
                    }`}>
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{t.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <button
                  onClick={handlePost}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#FF7F50] text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-[#FF7F50]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <SpinnerGap size={20} className="animate-spin" />
                      {isUploading ? "Uploading…" : (editId ? "Updating…" : "Publishing…")}
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={20} weight="fill" />
                      {editId ? "Update Post" : "Publish Post"}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
              <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Post Guidelines</h5>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-xs font-medium text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50] mt-1.5 shrink-0" />
                  <span>Postings are immediate and cannot be undone once published.</span>
                </li>
                <li className="flex items-start gap-3 text-xs font-medium text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50] mt-1.5 shrink-0" />
                  <span>Images are uploaded to secure cloud storage (max 10 MB).</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </PageSection>
  );
}
