import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function AdminRoute({children}) {
    const {user, loading} = useAuth();
    if(loading) return <div style={{padding: 24}}>Carregando...</div>;
    if(!user || user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
}