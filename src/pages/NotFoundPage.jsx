import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NotFoundPage = () => {
    const { isSidebarOpen } = useAuth();
    const navigate = useNavigate()
    const handleNavigation = () => {
        navigate(-1)
    }
    return (
        <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>404 - Page Not Found</h1>
                    <p style={styles.message}>
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <button onClick={() => handleNavigation()} style={styles.link}>Go back to Previous Page</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
        fontFamily: 'Arial, sans-serif',
    },
    card: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '90%',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2c3e50',
        marginBottom: '10px',
    },
    message: {
        fontSize: '1.1rem',
        color: '#7f8c8d',
        marginBottom: '20px',
    },
    link: {
        fontSize: '1rem',
        color: '#3182CE',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: '1px solid #3182CE',
        padding: '10px 20px',
        borderRadius: '5px',
        transition: '0.3s',
    },
};

export default NotFoundPage;
