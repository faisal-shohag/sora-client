
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate()
    const {user} = useAuth() 
    

    useEffect(() => {
        if(user.role === 'user'){  
            navigate('/lessons')
           
        }
    }, [user, navigate])

    return (
        <div>
          
        </div>
    );
};

export default Home;