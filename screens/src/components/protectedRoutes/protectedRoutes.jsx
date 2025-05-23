import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.auth.user);

    const token = localStorage.getItem('token');
    //console.log(user.role);
    if (!user || !token) {
        alert('Please login to access this page.');
        return <Navigate to="/" replace />;
    }

    if (user.role !== 'admin') {
        alert('You are not authorized to access this page.');
        return <Navigate to="/" replace />;
    }

    return children;
}
