import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-media" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Facebook size={20} /> Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Twitter size={20} /> Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Linkedin size={20} /> LinkedIn
          </a>
        </div>
        <div className="copyright">
          <p>&copy; 2026 NSENGIYUMVA Eric</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
