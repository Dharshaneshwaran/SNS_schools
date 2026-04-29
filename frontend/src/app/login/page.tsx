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
    <div className="flex min-h-screen overflow-hidden font-sans">
      {/* Left Side: Forms */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#121212] via-[#1e1e1e] to-primary flex flex-col justify-center items-center p-8 lg:p-16 relative text-white z-10 shadow-2xl">
        <Link href="/" className="absolute top-8 left-8 lg:top-12 lg:left-16 text-white no-underline font-extrabold text-2xl flex items-center gap-2">
          <GraduationCap className="text-primary" weight="fill" size={32} />
          SNS <span className="text-primary">Academy</span>
        </Link>

        <motion.div 
          className="w-full max-w-[450px] bg-white/5 backdrop-blur-[20px] p-8 lg:p-12 rounded-[24px] border border-white/10 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {!role ? (
              <motion.div 
                key="role-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-3xl font-poppins font-bold mb-2">Access Dashboard</h2>
                <p className="text-white/60 mb-10">Welcome back! Please select your role to continue.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setRole('teacher')}
                    className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary transition-all group cursor-pointer"
                  >
                    <ChalkboardTeacher size={48} className="text-primary group-hover:text-white transition-colors" />
                    <span className="font-semibold font-poppins">Teacher</span>
                  </button>
                  <button 
                    onClick={() => setRole('parent')}
                    className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary transition-all group cursor-pointer"
                  >
                    <Users size={48} className="text-primary group-hover:text-white transition-colors" />
                    <span className="font-semibold font-poppins">Parent</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => { setRole(null); setError(""); }}
                  className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-6 font-medium cursor-pointer"
                >
                  <ArrowLeft size={20} weight="bold" /> Back
                </button>
                
                <div className="mb-8">
                  <h2 className="text-3xl font-poppins font-bold capitalize">{role} Login</h2>
                  <p className="text-white/60">Enter your {role === 'parent' ? 'mobile number' : 'email'} and password</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3"
                  >
                    <Warning size={20} weight="fill" className="text-red-400 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 block font-poppins">
                      {role === 'parent' ? 'Mobile Number' : 'Email Address'}
                    </label>
                    <input 
                      type={role === 'parent' ? 'tel' : 'email'} 
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      placeholder={role === 'parent' ? 'Enter mobile number' : 'teacher@sns-erp.local'} 
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary focus:bg-white/8 transition-all text-white placeholder-white/30"
                      required
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-white/80 block font-poppins">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary focus:bg-white/8 transition-all text-white placeholder-white/30"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                      </button>
                    </div>
                  </div>

                  <Link href="#" className="block text-right text-sm text-primary hover:underline font-medium font-poppins">
                    Forgot Password?
                  </Link>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn btn-primary w-full justify-center py-4 text-lg font-poppins disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute bottom-8 left-0 w-full text-center text-xs text-white/40 px-4">
          <p>&copy; 2026 SNS Academy ERP. Empowering Education Through Design Thinking.</p>
        </div>
      </div>

      {/* Right Side: Image */}
      <div 
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/images/login-side.png')` }}
      >
        <div className="absolute inset-0 bg-primary/10" />
      </div>
    </div>
  );
}
