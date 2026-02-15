import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/api/content/footer')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Error fetching footer content:', err));
  }, []);

  if (!content) return null;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-media" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
          <a href={content.social.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Facebook size={20} /> Facebook
          </a>
          <a href={content.social.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Twitter size={20} /> Twitter
          </a>
          <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Linkedin size={20} /> LinkedIn
          </a>
        </div>
        <div className="copyright">
          <p>{content.copyright.text}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
