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
              <span style={{ color: "#FF7F50" }}>SNS</span> <span style={{ color: "#000000" }}>Academy</span>
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
            <div style={{ marginTop: 24, fontSize: 13, color: "#636E72", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 600, color: "#121212" }}>CBSE Affiliation: 1930610</span>
              <span>Established: 2014</span>
              <span>Coimbatore, Tamil Nadu</span>
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
              <li><Link href="/resources">Parent Handbook</Link></li>
              <li><Link href="/resources">Holiday List</Link></li>
              <li><Link href="/resources">Exam Schedules</Link></li>
              <li><Link href="/resources">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="footer-col-title">Connect With Us</p>
            <div className="footer-contact-item" style={{ alignItems: 'flex-start' }}>
              <MapPin size={17} style={{ marginTop: 4 }} />
              <span style={{ lineHeight: 1.5 }}>
                SNS Academy,<br />
                Thudiyalur - Saravanampatti Road,<br />
                Vellakinar Post,<br />
                Coimbatore - 641029
              </span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} />
              <span>Admission: 90036 55855</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={17} />
              <span>Office: 75300 93730</span>
            </div>
            <div className="footer-contact-item">
              <EnvelopeSimple size={17} />
              <span>info@snsacademy.org</span>
            </div>
            <div className="footer-contact-item">
              <EnvelopeSimple size={17} />
              <span>Career: job@snsgroups.com</span>
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
