import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/dashboard/lessons')
    }, [navigate])
    
    return (
        <div>
          
        </div>
    );
};

export default Dashboard;