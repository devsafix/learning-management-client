/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Menu,
  LogIn,
  CircleUser,
  ChevronDown,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import {
  useGetMeQuery,
  useLogoutUserMutation,
} from "@/redux/features/auth/auth.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { baseApi } from "@/redux/baseApi";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();

  const { data } = useGetMeQuery(undefined);
  const user = data?.data;

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
      dispatch(baseApi.util.resetApiState());
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors",
        scrolled ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-5 md:py-7">
        {/* Logo */}
        <Link to={"/"} className="text-xl font-bold text-white">
          Code Learner
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-8 text-white">
          {/* Links */}
          <div className="hidden md:flex items-center gap-6 roboto">
            <Link to="/all-courses" className="hover:text-primary">
              All Courses
            </Link>
            <Link to="/learning-path" className="hover:text-primary">
              Learning Path
            </Link>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  <CircleUser size={28} />
                  <ChevronDown size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mt-5 p-3 rounded-none"
                align="end"
                forceMount
              >
                <DropdownMenuItem asChild>
                  <Link to="/safety-settings">
                    <Home /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/safety-settings">
                    {" "}
                    <Settings /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 font-semibold"
                >
                  <LogOut className="text-red-600" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"/login"}>
              <Button
                variant="default"
                className="flex items-center gap-1 font-medium cursor-pointer"
              >
                <LogIn size={16} /> Login Now
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="menu"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
}
