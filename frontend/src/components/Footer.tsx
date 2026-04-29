import Link from "next/link";
import { GraduationCap, FacebookLogo, InstagramLogo, LinkedinLogo, EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer id="contact" className="py-24 bg-[#F8F9FA] border-t border-[#EEE]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div className="footer-info">
            <Link href="/" className="text-[1.8rem] font-extrabold mb-4 block">
              SNS <span className="text-primary">Academy</span>
            </Link>
            <p className="text-text-muted">Empowering students through Design Thinking and Innovation.</p>
            <div className="flex gap-4 mt-6">
              <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent shadow-soft hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <FacebookLogo size={20} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent shadow-soft hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <InstagramLogo size={20} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent shadow-soft hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                <LinkedinLogo size={20} />
              </Link>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="font-poppins font-semibold mb-6 text-[1.1rem]">Quick Links</h4>
            <ul className="list-none space-y-3">
              <li><Link href="#about" className="text-text-muted hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#features" className="text-text-muted hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#experience" className="text-text-muted hover:text-primary transition-colors">Experience</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary transition-colors">Admissions</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="font-poppins font-semibold mb-6 text-[1.1rem]">Resources</h4>
            <ul className="list-none space-y-3">
              <li><Link href="#" className="text-text-muted hover:text-primary transition-colors">Parent Handbook</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary transition-colors">Holiday List</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary transition-colors">Exam Schedules</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="font-poppins font-semibold mb-6 text-[1.1rem]">Contact Info</h4>
            <ul className="list-none space-y-3">
              <li className="flex items-center gap-3 text-text-muted"><EnvelopeSimple size={18} className="text-primary" /> info@snsacademy.org</li>
              <li className="flex items-center gap-3 text-text-muted"><Phone size={18} className="text-primary" /> +91 422 266 6222</li>
              <li className="flex items-center gap-3 text-text-muted"><MapPin size={18} className="text-primary" /> Coimbatore, Tamil Nadu</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-12 border-t border-[#EEE] text-text-muted text-sm">
          <p>&copy; 2026 SNS Academy ERP. All rights reserved. Designed with ❤️ by SNS Innovation Hub.</p>
        </div>
      </div>
    </footer>
  );
}
