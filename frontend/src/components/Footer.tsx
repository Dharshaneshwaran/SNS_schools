import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  EnvelopeSimple,
  Phone,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="page-container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" className="footer-brand-name">
              SNS <span>Academy</span>
            </Link>
            <p className="footer-desc">
              Empowering students through Design Thinking and Innovation.
              Building the future, one student at a time.
            </p>
            <div className="footer-socials">
              <Link href="#" className="social-btn"><FacebookLogo size={18} /></Link>
              <Link href="#" className="social-btn"><InstagramLogo size={18} /></Link>
              <Link href="#" className="social-btn"><LinkedinLogo size={18} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-col-title">Quick Links</p>
            <ul className="footer-links">
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#experience">Experience</Link></li>
              <li><Link href="#">Admissions</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="footer-col-title">Resources</p>
            <ul className="footer-links">
              <li><Link href="#">Parent Handbook</Link></li>
              <li><Link href="#">Holiday List</Link></li>
              <li><Link href="#">Exam Schedules</Link></li>
              <li><Link href="#">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="footer-col-title">Contact Info</p>
            <div className="footer-contact-item">
              <EnvelopeSimple size={17} />
              <span>info@snsacademy.org</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} />
              <span>+91 422 266 6222</span>
            </div>
            <div className="footer-contact-item">
              <MapPin size={17} />
              <span>Coimbatore, Tamil Nadu</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 SNS Academy ERP. All rights reserved. Designed with ❤️ by SNS Innovation Hub.</p>
        </div>
      </div>
    </footer>
  );
}
