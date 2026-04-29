"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Books, 
  ChalkboardTeacher, 
  Trophy, 
  UserCircle, 
  CalendarCheck, 
  CreditCard, 
  Notebook, 
  ChartLineUp, 
  BellRinging, 
  Clock, 
  UsersThree,
  Check,
  ArrowRight
} from "@phosphor-icons/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

export default function Home() {
  return (
    <main className="font-sans">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-bg-gradient relative overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[3.5rem] leading-[1.2] mb-6 text-accent font-poppins font-bold">
                Smart School Management with <span className="text-gradient">SNS ERP</span>
              </h1>
              <p className="text-lg text-text-muted mb-10 max-w-[500px]">
                Simplifying communication between parents, teachers, and administration through innovation and design thinking.
              </p>
              <div className="flex gap-6">
                <Link href="/login" className="btn btn-primary">Login Now</Link>
                <Link href="#features" className="btn btn-outline">Explore Features</Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-image relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="animate-float flex justify-center">
                <img 
                  src="/images/hero-dashboard.png" 
                  alt="SNS ERP Dashboard"
                  className="w-full max-w-[550px] rounded-[24px] shadow-medium"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="container-custom">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-[2.5rem] mb-4 font-poppins font-bold">Excellence in Education</h2>
            <p className="text-text-muted">Leading the digital transformation in Coimbatore&apos;s most progressive CBSE school.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Books size={48} />, title: "Academics", desc: "Design Thinking integrated CBSE curriculum for holistic development." },
              { icon: <ChalkboardTeacher size={48} />, title: "Experienced Faculty", desc: "Stanford-trained educators providing 10:1 personalized care." },
              { icon: <Trophy size={48} />, title: "Achievements", desc: "Consistently securing top ranks in national and international competitions." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="about-card glass border border-transparent hover:border-primary"
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-primary mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 font-poppins">{item.title}</h3>
                <p className="text-text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#FAFAFA]">
        <div className="container-custom">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-[2.5rem] mb-4 font-poppins font-bold">ERP Power Features</h2>
            <p className="text-text-muted">Everything you need to manage school life efficiently in one place.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <UserCircle size={32} />, title: "Student Dashboard", desc: "360-degree view of student progress and activities." },
              { icon: <CalendarCheck size={32} />, title: "Attendance Tracking", desc: "Real-time updates and monthly attendance reports." },
              { icon: <CreditCard size={32} />, title: "Fee Management", desc: "Secure online payments and automated fee receipts." },
              { icon: <Notebook size={32} />, title: "Homework & Diary", desc: "Daily assignments and teacher notes at your fingertips." },
              { icon: <ChartLineUp size={32} />, title: "Academic Reports", desc: "Detailed performance analytics and exam results." },
              { icon: <BellRinging size={32} />, title: "Notifications", desc: "Instant alerts for school events and emergencies." },
              { icon: <Clock size={32} />, title: "Timetable", desc: "Easy access to class schedules and substitutions." },
              { icon: <UsersThree size={32} />, title: "Multi-Student Support", desc: "Manage multiple children from a single parent login." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="feature-card group"
                {...fadeIn}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-primary mb-4 group-hover:text-white transition-colors">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 font-poppins">{feature.title}</h3>
                <p className="text-text-muted group-hover:text-white/80 transition-colors text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div className="order-2 lg:order-1 flex justify-center" {...fadeIn}>
              <img 
                src="/images/experience-section.png" 
                alt="Experience Illustration" 
                className="w-full max-w-[500px] rounded-[24px]"
              />
            </motion.div>
            <motion.div className="order-1 lg:order-2" {...fadeIn}>
              <h2 className="text-[2.5rem] mb-6 font-poppins font-bold">Tailored for Every Role</h2>
              <p className="text-text-muted mb-8">Whether you&apos;re a parent tracking growth or a teacher managing a classroom, SNS ERP adapts to your needs.</p>
              
              <div className="flex flex-col sm:flex-row gap-12">
                <div className="flex-1">
                  <h4 className="text-primary font-bold mb-4 uppercase tracking-wider">Parents</h4>
                  <ul className="exp-list">
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> Track Progress</li>
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> View Fees & Attendance</li>
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> Instant Notifications</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <h4 className="text-primary font-bold mb-4 uppercase tracking-wider">Teachers</h4>
                  <ul className="exp-list">
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> Manage Classes</li>
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> Upload Homework</li>
                    <li><Check size={20} className="text-primary bg-primary/10 p-1 rounded-full" weight="bold" /> Digital Attendance</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <motion.div className="cta-card" {...fadeIn}>
            <div className="relative z-10 max-w-[800px] mx-auto">
              <h2 className="text-[2.8rem] md:text-[3.5rem] mb-6 font-poppins font-bold leading-tight">
                Ready to transform your <br className="hidden md:block" /> school management?
              </h2>
              <p className="mb-10 opacity-90 text-xl max-w-[600px] mx-auto">
                Join hundreds of educators already using SNS ERP to simplify their daily operations and focus on what matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login" className="btn btn-primary px-10 py-4 text-lg">
                  Access Dashboard <ArrowRight size={22} weight="bold" />
                </Link>
                <Link href="#contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-accent px-10 py-4 text-lg">
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
