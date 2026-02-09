import { Mail, MapPin, Phone } from 'lucide-react';

function Contact({ data }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Mail size={28} />
                    {data?.title || "Contact Us"}
                </h3>
                <p style={{ textAlign: 'center' }}>{data?.description}</p>
                <div className="contact-details">
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} /> <strong>Address:</strong> 123 Garden Avenue, Tech City
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={20} /> <strong>Phone:</strong> +260 977 123456
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={20} /> <strong>Email:</strong> info@gardentss.edu.zm
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contact;
