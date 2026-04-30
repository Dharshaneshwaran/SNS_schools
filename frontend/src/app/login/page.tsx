"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChalkboardTeacher,
  Users,
  Eye,
  EyeSlash,
  Warning,
  ArrowRight,
  Shield,
  Sparkle,
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";
import { getDashboardRoute } from "../../lib/role-access";

export default function LoginPage() {
  const [role, setRole] = useState<null | "teacher" | "parent">(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const session = await login({ email: emailOrMobile, password });
      router.push(getDashboardRoute(session.user.role));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please verify your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "var(--font-inter, 'Inter', sans-serif)",
        overflow: "hidden",
      }}
    >
      {/* ── Left Panel: Form ── */}
      <div
        className="mesh-bg"
        style={{
          width: "100%",
          maxWidth: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background: "#FFFFFF",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Background Decorative Elements */}
        <div className="bg-glow" style={{ top: "-5%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(255, 127, 80, 0.1), transparent 70%)" }} />
        <div className="bg-glow" style={{ bottom: "-5%", right: "-5%", width: 350, height: 350, background: "radial-gradient(circle, rgba(79, 70, 229, 0.06), transparent 70%)", animationDelay: "-3s" }} />

        {/* Logo */}
        <Link
          href="/"
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#121212",
            fontWeight: 800,
            fontSize: 22,
            fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
          }}
        >
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              style={{ width: "100%", height: "auto", objectFit: "contain" }} 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          SNS <span style={{ color: "#FF7F50" }}>Academy</span>
        </Link>

        {/* Card */}
        <motion.div
          style={{ width: "100%", padding: "0 32px", maxWidth: 480 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
              padding: "44px 40px",
              width: "100%",
            }}
          >
            <AnimatePresence mode="wait">
              {!role ? (
                /* ── Step 1: Role Selection ── */
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: 32 }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#121212",
                        marginBottom: 8,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Welcome Back
                    </h2>
                    <p style={{ color: "#636E72", fontSize: 14, lineHeight: 1.6 }}>
                      Select your role to access the SNS Academy ERP portal.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    {[
                      { key: "admin" as const, icon: <Shield size={40} weight="duotone" />, label: "Admin" },
                      { key: "teacher" as const, icon: <ChalkboardTeacher size={40} weight="duotone" />, label: "Teacher" },
                      { key: "parent" as const, icon: <Users size={40} weight="duotone" />, label: "Parent" },
                    ].map(({ key, icon, label }) => (
                      <RoleCard
                        key={key}
                        icon={icon}
                        label={label}
                        onClick={() => setRole(key)}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "rgba(255,127,80,0.08)",
                      border: "1px solid rgba(255,127,80,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Shield size={18} style={{ color: "#FF7F50", flexShrink: 0 }} weight="fill" />
                    <p style={{ color: "#636E72", fontSize: 12.5, lineHeight: 1.5 }}>
                      Secured with end-to-end encryption. Your data is safe.
                    </p>
                  </div>
                </motion.div>

              ) : (
                /* ── Step 2: Login Form ── */
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => {
                      setRole(null);
                      setError("");
                      setEmailOrMobile("");
                      setPassword("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#636E72",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                      marginBottom: 24,
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#FF7F50"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#636E72"; }}
                  >
                    <ArrowLeft size={16} weight="bold" /> Back to role selection
                  </button>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      {role === "admin"
                        ? <Shield size={22} style={{ color: "#FF7F50" }} weight="duotone" />
                        : role === "teacher"
                          ? <ChalkboardTeacher size={22} style={{ color: "#FF7F50" }} weight="duotone" />
                          : <Users size={22} style={{ color: "#FF7F50" }} weight="duotone" />
                      }
                      <h2
                        style={{
                          fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#121212",
                          letterSpacing: "-0.02em",
                          textTransform: "capitalize",
                        }}
                      >
                        {role} Login
                      </h2>
                    </div>
                    <p style={{ color: "#636E72", fontSize: 13.5 }}>
                      Enter your {role === "parent" ? "mobile number" : "email address"} and password
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginBottom: 20,
                        padding: "12px 14px",
                        background: "rgba(239,68,68,0.12)",
                        border: "1px solid rgba(239,68,68,0.28)",
                        borderRadius: 10,
                        color: "#fca5a5",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Warning size={18} weight="fill" style={{ color: "#f87171", flexShrink: 0 }} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Email / Mobile */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>
                        {role === "parent" ? "Mobile Number" : "Email Address"}
                      </label>
                      <input
                        type={role === "parent" ? "tel" : "email"}
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        placeholder={role === "admin" ? "admin@sns-erp.local" : role === "parent" ? "+91 9XXXXXXXXX" : "teacher@sns-erp.local"}
                        required
                        style={inputStyle}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FF7F50";
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          style={{ ...inputStyle, paddingRight: 48 }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#FF7F50";
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#636E72",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div style={{ textAlign: "right", marginBottom: 24 }}>
                      <Link
                        href="#"
                        style={{ fontSize: 12.5, color: "#FF7F50", textDecoration: "none", fontWeight: 500 }}
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        padding: "16px 0",
                        borderRadius: 8,
                        background: isLoading ? "rgba(255,127,80,0.5)" : "#FF7F50",
                        color: "white",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#121212";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#FF7F50";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {isLoading ? "Signing In..." : (
                        <><span>Sign In</span><ArrowRight size={18} weight="bold" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <p
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 11.5,
            color: "#636E72",
          }}
        >
          © 2026 SNS Academy ERP · Empowering Education Through Design Thinking
        </p>
      </div>

      {/* ── Right Panel: Decorative ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/login-side.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(255,127,80,0.35) 100%)",
          }}
        />

        {/* Content over image */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 48px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 14px",
                background: "#FF7F50",
                color: "white",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 24,
                borderRadius: 4,
              }}
            >
              SNS Academy ERP
            </div>

            <h2
              style={{
                fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Empowering Education<br />Through Innovation
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 500, lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
              A unified platform for parents, teachers, and administrators — 
              bridging the gap between school and home.
            </p>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 36,
                flexWrap: "wrap",
              }}
            >
              {["CBSE Affiliated", "ISO Certified", "Design Thinking Hub"].map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 50,
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    color: "#121212",
                    fontSize: 12,
                    fontWeight: 500,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function RoleCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "40px 24px",
        borderRadius: 24,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(0,0,0,0.06)",
        color: "#121212",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#FF7F50";
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(255,127,80,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40%", background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)", pointerEvents: "none" }} />
      
      <div style={{ 
        width: 64, height: 64, borderRadius: 20, 
        background: "rgba(255,127,80,0.1)", 
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#FF7F50", transition: "all 0.3s" 
      }}>
        {icon}
      </div>
      <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>{label}</span>
    </motion.button>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
  marginBottom: 7,
  fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: 16,
  background: "rgba(0,0,0,0.02)",
  border: "1px solid rgba(0,0,0,0.08)",
  outline: "none",
  color: "#121212",
  fontSize: 15,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontFamily: "var(--font-inter, 'Inter', sans-serif)",
  fontWeight: 500,
};
