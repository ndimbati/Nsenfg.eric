import { Mail, MapPin, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

function Contact() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch('/api/content/contact')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error('Error fetching contact content:', err));
    }, []);

    if (!content) return <div className="loading">Loading...</div>;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'white' }}>
                    <Mail size={28} />
                    {content.header.title}
                </h3>
                <div className="contact-details">
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '600' }}>
                        <MapPin size={20} /> <strong>Address:</strong> {content.details.address}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '600' }}>
                        <Phone size={20} /> <strong>Phone:</strong> {content.details.phone}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '600' }}>
                        <Mail size={20} /> <strong>Email:</strong> {content.details.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contact;
