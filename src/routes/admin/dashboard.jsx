import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
    const {logout} = useAuth()

    return (
        <div>


            Admin Dashboard
            <Button onClick={logout}>Logout</Button>
        </div>
    );
};

export default Dashboard;