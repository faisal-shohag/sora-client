
import useAuth from "@/hooks/useAuth";
import {  BookOpen, Video } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const MobileNav = () => {
    const { user } = useAuth();
    const location = useLocation()
  
 
  
    if (user && user.role === "admin") return null;
    if (location.pathname === "/login" || location.pathname === "/signup") return null;
  
  

    return (
        <div id="mobilenav" className="custom-glass2 fixed bottom-0 left-0 dark:bg-zinc-900 w-full px-8 py-2 z-50  flex items-center justify-center gap-20 font-bold  h-[60px]">
            <NavLink to="/lessons" className="flex flex-col items-center justify-center gap-0">
            <BookOpen/>
            <div className="text-[12px]">Lessons</div>
            </NavLink>

            <NavLink to="/tutorials" className="flex flex-col items-center justify-center gap-0">
            <Video/>
            <div className="text-[12px]">Tutorials</div>
            </NavLink>

        </div>
    );
};

export default MobileNav;