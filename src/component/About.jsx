import { Info, Target, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

function About() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch('/api/content/about')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error('Error fetching about content:', err));
    }, []);

    if (!content) return <div className="loading">Loading...</div>;

    return (
        <div className="about">
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Info size={28} />
                    {content.header.title}
                </h3>
                <div className="extra-content">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={20} /> Our Mission
                    </h4>
                    <p>{content.mission.text}</p>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Eye size={20} /> Our Vision
                    </h4>
                    <p>{content.vision.text}</p>
                </div>
            </div>
        </div>
    );
}

export default About;
