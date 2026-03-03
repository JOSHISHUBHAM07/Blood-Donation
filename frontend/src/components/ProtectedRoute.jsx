import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute
 * - If not authenticated → redirect to /login
 * - If authenticated but wrong role → redirect to /
 * - role prop is optional; if omitted, only auth is checked
 */
const ProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
