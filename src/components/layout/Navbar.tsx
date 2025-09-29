/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Menu,
  LogIn,
  ChevronDown,
  Home,
  LogOut,
  X,
  BookOpen,
  Map,
  User,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";
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
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const location = useLocation();

  const { data } = useGetMeQuery(undefined);
  const user = data?.data;
  const role = data?.data?.role;

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/all-courses", label: "All Courses", icon: BookOpen },
    { href: "/learning-path", label: "Learning Path", icon: Map },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-black/50 backdrop-blur-3xl shadow-lg shadow-black/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-5">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-3 group">
            <img src={logo} alt="logo" className="h-10 w-" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-8">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-3">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-2 text-white/90 font-medium transition-all duration-300 group relative px-3 py-2 rounded-lg ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Welcome Text - Desktop only */}
                <div className="hidden md:block text-right">
                  <p className="text-white/90 text-sm">Welcome back,</p>
                  <p className="text-white font-medium text-sm truncate max-w-24">
                    {user.name}
                  </p>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 mt-3 p-2 bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-xl"
                    align="end"
                    forceMount
                  >
                    {/* User Info Header */}
                    <div className="px-3 py-3 border-b border-gray-200 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <DropdownMenuItem asChild className="rounded-lg mb-1">
                      {role === "user" ? (
                        <Link
                          to="/user/my-courses"
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-500">
                              Manage your courses
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to="/admin/analytics"
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Admin Panel</p>
                            <p className="text-xs text-gray-500">
                              Analytics & Management
                            </p>
                          </div>
                        </Link>
                      )}
                    </DropdownMenuItem>

                    {role === "user" && (
                      <DropdownMenuItem asChild className="rounded-lg mb-1">
                        <Link
                          to="/user/my-profile"
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">My Profile</p>
                            <p className="text-xs text-gray-500">
                              Update your information
                            </p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 font-medium rounded-lg flex items-center gap-3 px-3 py-2"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-red-500">
                          Log out of your account
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to={"/login"}>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10 hover:text-white rounded-xl w-10 h-10"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div
            className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-h-[calc(100vh-6rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Code Learner
                </h2>
              </div>

              {/* Mobile Navigation Links */}
              <div>
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile User Section */}
              {user && (
                <div className="border-gray-200">
                  <Link
                    to={
                      role === "user" ? "/user/my-courses" : "/admin/analysis"
                    }
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {role === "user" ? (
                        <Home className="w-4 h-4 text-blue-600" />
                      ) : (
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {role === "user" ? "Dashboard" : "Admin Panel"}
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors duration-200 text-red-600"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
