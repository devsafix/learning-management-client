import { useEffect, useState } from "react";
import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const user = false;

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
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-9 h-9 rounded-full border"
              />
              <span className="hidden md:inline">Kawser Ferdous</span>
            </div>
          ) : (
            <Button
              variant="default"
              className="flex items-center gap-1 font-medium"
            >
              <LogIn size={16} /> Login Now
            </Button>
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
