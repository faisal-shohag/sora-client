import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOutIcon } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import useAuth from "@/hooks/useAuth";

const NavBar = () => {
  const { user, logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };

  if (user && user.role === "admin") return null;

  return (
    <div className="border Nav p-3 shadow-lg flex gap-5 lg:px-[100px]  justify-between items-center">
      <div className="animate-pulse">
        <img
          className="h-8 w-8"
          src="https://i.postimg.cc/XYSGZD9T/logo.png"
          alt="logo"
        />
      </div>

      <div className="lg:block md:block hidden">
        <div className="flex items-center gap-10">
          <NavLink to="/">
            <span>Home</span>
          </NavLink>
          <NavLink to="/lessons">
            <span>Lessons</span>
          </NavLink>
          <NavLink to="/tutorials">
            <span>Tutorials</span>
          </NavLink>
        </div>
      </div>
      <div className="block font-black text-xl lg:hidden md:hidden bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400  text-transparent bg-clip-text">
        ContestHUB
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
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
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
