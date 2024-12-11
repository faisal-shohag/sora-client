import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useEffect } from "react";

const Home = () => {
    const axiosSecure = useAxiosSecure()
   useEffect(()=>{
    axiosSecure.get('/find')
    .then(res=>console.log(res))
   },[axiosSecure])
    return (
        <div>
            Home
        </div>
    );
};

export default Home;