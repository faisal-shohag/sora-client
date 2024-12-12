import { NavLink, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import useAuth from "@/hooks/useAuth";

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation()

  const handleLogOut = () => {
    logout();
  };

  if (user && user.role === "admin") return null;
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  return (
    <div className="border Nav p-3 shadow-lg flex gap-5 lg:px-[100px]  justify-between items-center">
      <div className="animate-pulse">
      <h1 className='text-xl font-bold text-center'>~<span className='text-red-500'>日本</span>~ Learn</h1>
      </div>

      <div className="lg:block md:block hidden">
        <div className="flex items-center gap-10">
          <NavLink to="/lessons">
            <span>Lessons</span>
          </NavLink>
          <NavLink to="/tutorials">
            <span>Tutorials</span>
          </NavLink>
        </div>
      </div>
  
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div>
                  <img className="w-8 h-8 rounded-full" src={user.avatar} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogOut}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
