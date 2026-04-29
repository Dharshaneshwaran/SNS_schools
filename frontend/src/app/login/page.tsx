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
    <div className="flex min-h-screen overflow-hidden" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)", background: "#FFFFFF" }}>
      {/* Left Side */}
      <div 
        className="w-full lg:w-1/2 flex flex-col justify-center items-center relative z-10"
        style={{ 
          background: "#FFFFFF",
        }}
      >
        {/* Logo */}
        <Link 
          href="/" 
          className="absolute top-10 left-10 lg:top-12 lg:left-14 no-underline font-extrabold text-2xl flex items-center gap-3"
          style={{ color: "#2D3436" }}
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
              background: "#FFFFFF",
              borderRadius: 24,
              border: "1px solid #ECEFF1",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
              padding: "40px 32px",
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
                      fontSize: 26, 
                      fontWeight: 700, 
                      marginBottom: 8,
                      color: "#2D3436",
                      letterSpacing: "-0.02em"
                    }}
                  >
                    Access Dashboard
                  </h2>
                  <p style={{ color: "#636E72", fontSize: 14, marginBottom: 32, lineHeight: 1.5 }}>
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
                        gap: 12,
                        padding: "24px 16px",
                        borderRadius: 16,
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        color: "#2D3436",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FF7F50";
                        e.currentTarget.style.borderColor = "#FF7F50";
                        e.currentTarget.style.color = "#FFFFFF";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 127, 80, 0.25)";
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.color = "#2D3436";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#FF7F50';
                      }}
                    >
                      <ChalkboardTeacher size={36} weight="duotone" style={{ color: "#FF7F50", transition: "color 0.2s" }} />
                      <span style={{ fontWeight: 600, fontSize: 14, fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}>Teacher</span>
                    </button>
                    <button 
                      onClick={() => setRole('parent')}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        padding: "24px 16px",
                        borderRadius: 16,
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        color: "#2D3436",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FF7F50";
                        e.currentTarget.style.borderColor = "#FF7F50";
                        e.currentTarget.style.color = "#FFFFFF";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 127, 80, 0.25)";
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.color = "#2D3436";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#FF7F50';
                      }}
                    >
                      <Users size={36} weight="duotone" style={{ color: "#FF7F50", transition: "color 0.2s" }} />
                      <span style={{ fontWeight: 600, fontSize: 14, fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}>Parent</span>
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
                      color: "#636E72",
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
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#636E72"; }}
                  >
                    <ArrowLeft size={18} weight="bold" /> Back
                  </button>
                  
                  <div style={{ marginBottom: 32 }}>
                    <h2 
                      style={{ 
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        fontSize: 26, 
                        fontWeight: 700, 
                        marginBottom: 8,
                        color: "#2D3436",
                        textTransform: "capitalize",
                        letterSpacing: "-0.02em"
                      }}
                    >
                      {role} Login
                    </h2>
                    <p style={{ color: "#636E72", fontSize: 14, lineHeight: 1.5 }}>
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
                        background: "#FEF2F2",
                        border: "1px solid #FCA5A5",
                        borderRadius: 12,
                        color: "#991B1B",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Warning size={20} weight="fill" style={{ color: "#EF4444", flexShrink: 0 }} />
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
                          color: "#4A5568", 
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
                          padding: "12px 16px",
                          borderRadius: 12,
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          outline: "none",
                          color: "#2D3436",
                          fontSize: 14,
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#FF7F50";
                          e.currentTarget.style.background = "#FFFFFF";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 127, 80, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.background = "#F8FAFC";
                          e.currentTarget.style.boxShadow = "none";
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
                          color: "#4A5568", 
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
                            padding: "12px 46px 12px 16px",
                            borderRadius: 12,
                            background: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            outline: "none",
                            color: "#2D3436",
                            fontSize: 14,
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#FF7F50";
                            e.currentTarget.style.background = "#FFFFFF";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 127, 80, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#E2E8F0";
                            e.currentTarget.style.background = "#F8FAFC";
                            e.currentTarget.style.boxShadow = "none";
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
                            color: "#94A3B8",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {showPassword ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
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
                        padding: "14px 0",
                        borderRadius: 12,
                        background: isLoading ? "rgba(255, 127, 80, 0.6)" : "#FF7F50",
                        color: "white",
                        border: "none",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-poppins, 'Poppins', sans-serif)",
                        boxShadow: "0 6px 18px rgba(255, 127, 80, 0.25)",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.02em"
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#e66a3e";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 127, 80, 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = "#FF7F50";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 6px 18px rgba(255, 127, 80, 0.25)";
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
            fontSize: 11,
            color: "#94A3B8",
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
