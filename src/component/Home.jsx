import './Home.css';
import { GraduationCap, Users, User, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

function Home() {
    const [content, setContent] = useState(null);
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch('/api/content/home')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error('Error fetching home content:', err));
    }, []);

    useEffect(() => {
        if (content?.hero?.fullText && currentIndex < content.hero.fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + content.hero.fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 150);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, content]);

    if (!content) return <div className="loading">Loading...</div>;

    return (
        <div className="home">
            <img className="home-bg-image" src={content.hero.bgImage} alt="background" />
            <div className="home-inner">
                <h3 className="home-title">
                    <GraduationCap size={28} />
                    {displayedText}
                </h3>

                <div className="cards-container">
                    <div className="card">
                        <h4 className="card-title">
                            <Users size={20} /> Users
                        </h4>
                        <ul className="user-list">
                            {content.users.list.map((user, idx) => (
                                <li key={idx} className="user-item">
                                    <User size={16} /> {user}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <h4 className="card-title">
                            <ImageIcon size={20} /> Image Card
                        </h4>
                        <img className="card-image" src={content.cards.image1} alt="Logo" />
                    </div>

                    <div className="card">
                        <h4 className="card-title"></h4>
                        <img className="card-image" src={content.cards.image2} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
