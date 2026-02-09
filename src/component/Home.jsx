import './Home.css';
import { GraduationCap, Users, User, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

function Home({ data }) {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = 'WELCOME TO THE GARDEN TSS TO GET THE BEST TECHNICAL EDUCATIONAL EXPERIENCE AND ACADEMIC INNOVATION BECAUSE WE ARE THE BEST FOR CAREER DEVELOPMENT AND FUTURE SUCCESS';
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 150); // Adjust speed as needed
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, fullText]);
    return (
        <div className="home">
            <img className="home-bg-image" src="https://media.istockphoto.com/id/1830042746/photo/document-management-system-dms-with-arrange-folder-and-files-icons-man-setup-storage-backup.jpg?s=612x612&w=0&k=20&c=t8oAAO16j6fMhleAYJEXm5pSXFIDZrEG6sYJkv_Sdos=" alt="background" />
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
                            <li className="user-item">
                                <User size={16} /> NSENGIYUMVA Eric
                            </li>
                            <li className="user-item">
                                <User size={16} /> HAKIZIMANA Aimable
                            </li>
                             <li className="user-item">
                                <User size={16} /> CYUZUZO J.Bosco
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <h4 className="card-title">
                            <ImageIcon size={20} /> Image Card
                        </h4>
                        <img className="card-image" src="https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/577017538_122203495460430213_338196711157474203_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_9QDa13EM2gQ7kNvwGl21ht&_nc_oc=AdmxJKtHk1VSSq-bmtbX14qO5CqQRVaxIMlnXgEZKNO8E6XMUh8mbpnZZ8X20HIMHZw&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=zwUam4vHrDO1Rug8pyK-Rw&oh=00_AfsY_0eFVZKbuewuSJciF6Vqjh5jiElZvxhQ4T6UjMTv7g&oe=698B4FDA" alt="Logo" />
                    </div>

                    <div className="card">
                        <h4 className="card-title"></h4>
                        <img className="card-image" src="\\IMAGES\\ccccc.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
