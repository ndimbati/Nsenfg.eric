import { Users, User } from 'lucide-react';
import { useState, useEffect } from 'react';

function Team() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch('/api/content/team')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error('Error fetching team content:', err));
    }, []);

    if (!content) return <div className="loading">Loading...</div>;

    return (
        <div className="team">
            <div className="team-card">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Users size={28} />
                    {content.header.title}
                </h3>
                <ul className="member-list">
                    {content.members.list.map((member, idx) => (
                        <li key={idx}>
                            <User size={18} /> <strong>{member.role}:</strong> {member.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Team;
