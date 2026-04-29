"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  ArrowLeft, 
  ChalkboardTeacher, 
  Users, 
  Eye, 
  EyeSlash,
  Warning
} from "@phosphor-icons/react";
import { useAuth } from "../../hooks/use-auth";

export default function LoginPage() {
  const [role, setRole] = useState<null | 'teacher' | 'parent'>(null);
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
      await login({ email: emailOrMobile, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      {/* Left Side */}
      <div 
        className="w-full lg:w-1/2 flex flex-col justify-center items-center relative text-white z-10"
        style={{ 
          background: "linear-gradient(135deg, #121212 0%, #1a1a1a 40%, #1E1E1E 60%, #FF7F50 150%)",
          boxShadow: "8px 0 40px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Logo */}
        <Link 
          href="/" 
          className="absolute top-10 left-10 lg:top-12 lg:left-14 no-underline font-extrabold text-2xl flex items-center gap-3"
          style={{ color: "white" }}
        >
          <GraduationCap style={{ color: "#FF7F50" }} weight="fill" size={34} />
          <span>SNS <span style={{ color: "#FF7F50" }}>Academy</span></span>
        </Link>

        {/* Main Card */}
        <motion.div 
          className="w-full"
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 24px",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              padding: "48px 40px",
            }}
          >
            <AnimatePresence mode="wait">
              {!role ? (
                /* Step 1: Role Selection */
                <motion.div 
                  key="role-selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 
                    style={{ 
                      fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                      fontSize: 28, 
                      fontWeight: 700, 
                      marginBottom: 8,
                      color: "white",
                      letterSpacing: "-0.02em"
                    }}
                  >
                    Access Dashboard
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40, lineHeight: 1.5 }}>
                    Welcome back! Please select your role to continue.
                  </p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <button 
                      onClick={() => setRole('teacher')}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        padding: "36px 20px",
                        borderRadius: 16,
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      className="hover:!bg-[#FF7F50] hover:!border-[#FF7F50]"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FF7F50";
                        e.currentTarget.style.borderColor = "#FF7F50";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 127, 80, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <ChalkboardTeacher size={44} weight="duotone" style={{ color: "#FF7F50" }} />
                      <span style={{ fontWeight: 600, fontSize: 15, fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}>Teacher</span>
                    </button>
                    <button 
                      onClick={() => setRole('parent')}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        padding: "36px 20px",
                        borderRadius: 16,
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FF7F50";
                        e.currentTarget.style.borderColor = "#FF7F50";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 127, 80, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Users size={44} weight="duotone" style={{ color: "#FF7F50" }} />
                      <span style={{ fontWeight: 600, fontSize: 15, fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}>Parent</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Step 2: Login Form */
                <motion.div 
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button 
                    onClick={() => { setRole(null); setError(""); setEmailOrMobile(""); setPassword(""); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(255,255,255,0.5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 28,
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#FF7F50"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    <ArrowLeft size={18} weight="bold" /> Back
                  </button>
                  
                  <div style={{ marginBottom: 32 }}>
                    <h2 
                      style={{ 
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        fontSize: 28, 
                        fontWeight: 700, 
                        marginBottom: 8,
                        color: "white",
                        textTransform: "capitalize",
                        letterSpacing: "-0.02em"
                      }}
                    >
                      {role} Login
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.5 }}>
                      Enter your {role === 'parent' ? 'mobile number' : 'email'} and password
                    </p>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginBottom: 24,
                        padding: "14px 16px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: 12,
                        color: "#fca5a5",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Warning size={20} weight="fill" style={{ color: "#f87171", flexShrink: 0 }} />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Email / Mobile Field */}
                    <div style={{ marginBottom: 20 }}>
                      <label 
                        style={{ 
                          display: "block", 
                          fontSize: 13, 
                          fontWeight: 600, 
                          color: "rgba(255,255,255,0.7)", 
                          marginBottom: 8,
                          fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                          letterSpacing: "0.02em"
                        }}
                      >
                        {role === 'parent' ? 'Mobile Number' : 'Email Address'}
                      </label>
                      <input 
                        type={role === 'parent' ? 'tel' : 'email'} 
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        placeholder={role === 'parent' ? 'Enter mobile number' : 'teacher@sns-erp.local'} 
                        required
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          borderRadius: 12,
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          outline: "none",
                          color: "white",
                          fontSize: 15,
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FF7F50";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        }}
                      />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: 16 }}>
                      <label 
                        style={{ 
                          display: "block", 
                          fontSize: 13, 
                          fontWeight: 600, 
                          color: "rgba(255,255,255,0.7)", 
                          marginBottom: 8,
                          fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                          letterSpacing: "0.02em"
                        }}
                      >
                        Password
                      </label>
                      <div style={{ position: "relative" }}>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          required
                          style={{
                            width: "100%",
                            padding: "14px 50px 14px 18px",
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            outline: "none",
                            color: "white",
                            fontSize: 15,
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#FF7F50";
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "rgba(255,255,255,0.4)",
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
                    <div style={{ textAlign: "right", marginBottom: 28 }}>
                      <Link 
                        href="#" 
                        style={{ 
                          fontSize: 13, 
                          color: "#FF7F50", 
                          textDecoration: "none",
                          fontWeight: 500,
                          fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Sign In Button */}
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        padding: "16px 0",
                        borderRadius: 14,
                        background: isLoading ? "rgba(255, 127, 80, 0.6)" : "#FF7F50",
                        color: "white",
                        border: "none",
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        boxShadow: "0 8px 24px rgba(255, 127, 80, 0.35)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.02em"
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#e66a3e";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 127, 80, 0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#FF7F50";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 127, 80, 0.35)";
                        }
                      }}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <div 
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            padding: "0 16px",
          }}
        >
          <p>&copy; 2026 SNS Academy ERP. Empowering Education Through Design Thinking.</p>
        </div>
      </div>

      {/* Right Side: Image */}
      <div 
        className="hidden lg:block"
        style={{ 
          width: "50%",
          backgroundImage: "url('/images/login-side.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(255, 127, 80, 0.08)" }} />
      </div>
    </div>
  );
}
