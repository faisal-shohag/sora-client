
import useAuth from "@/hooks/useAuth";

const Home = () => {

    const {user} = useAuth() 

    return (
        <div>
            Home
           {user?.name}
           <img src={user.avatar}/>
            
        </div>
    );
};

export default Home;