import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function Header({ data }) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="header">
            <div className="centered-content">
                <br /><br /><br /><br /><br />
                <h1 className="h1 typewriter">{data?.title || "Garden Tips"}</h1>
                <p className="subtitle-fade">{data?.subtitle || "React JS UI Project"}</p>
                <form onSubmit={handleSearch} style={{ marginTop: '20px', display: 'flex', gap: '10px', maxWidth: '100%', margin: '20px 0 0 0', justifyContent: 'flex-end' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        style={{
                            flex: 1,
                            padding: '10px 15px',
                            border: '2px solid white',
                            borderRadius: '25px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: '600',
                            color: '#667eea',
                            // alignContent:'flex-end'
                        }}
                    >
                        <Search size={18} />
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Header;