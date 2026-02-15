import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

function NotFound() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch('/api/content/notfound')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error('Error fetching notfound content:', err));
    }, []);

    if (!content) {
        return (
            <div className="not-found">
                <div className="centered-content">
                    <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'white' }}>
                        <AlertCircle size={32} />
                        404 - Page Not Found
                    </h2>
                    <p style={{ color: 'white' }}>The page you are looking for does not exist.</p>
                    <Link to="/">Go back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="not-found">
            <div className="centered-content">
                <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'white' }}>
                    <AlertCircle size={32} />
                    {content.header?.title || '404 - Page Not Found'}
                </h2>
                <p style={{ color: 'white' }}>{content.message?.text || 'The page you are looking for does not exist.'}</p>
                <Link to="/">{content.link?.text || 'Go back to Home'}</Link>
            </div>
        </div>
    );
}

export default NotFound;