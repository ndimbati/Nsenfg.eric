import { Users, User } from 'lucide-react';

function Team({ data }) {
    return (
        <div className="team">
            <div className="team-card">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Users size={28} />
                    {data?.title || "Our Team"}
                </h3>
                <p className="team-description">{data?.description}</p>
                <ul className="member-list">
                    <li>
                        <User size={18} /> <strong>Principal:</strong> Mr. Eric M.
                    </li>
                    <li>
                        <User size={18} /> <strong>Vice Principal:</strong> Ms. Sarah K.
                    </li>
                    <li>
                        <User size={18} /> <strong>Head of Technical Dept:</strong> Mr. John D.
                    </li>
                    <li>
                        <User size={18} /> <strong>Head of Science Dept:</strong> Mrs. Jane S.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Team;
