import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found">
            <div className="centered-content">
                <h2>Page Not Found</h2>
                <p>Sorry, the page you're looking for doesn't exist.</p>
                <Link to="/">Go Back to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;
