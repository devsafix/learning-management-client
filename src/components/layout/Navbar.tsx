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
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useGetMeQuery(undefined);
  const user = data?.data;

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
        <div className="text-xl font-bold">Code Learner</div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Links */}
          <div className="hidden md:flex items-center gap-6 roboto">
            <a href="#courses" className="hover:text-primary">
              All Courses
            </a>
            <a href="#path" className="hover:text-primary">
              Learning Path
            </a>
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
                <DropdownMenuLabel className="font-normal bg-gray-300 mb-1">
                  <div className="flex items-center gap-1">
                    <CircleUser size={16} />
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                  </div>
                </DropdownMenuLabel>
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
