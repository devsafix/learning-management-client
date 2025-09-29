import { Link } from "react-router";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0A091A] via-[#0f0e1f] to-[#0A091A] text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex md:flex-row flex-col items-start md:items-center justify-between">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <img src={logo} alt="logo" className="h-10" />
                <p className="text-gray-300 leading-relaxed max-w-md text-lg mt-4">
                  Empowering developers worldwide with hands-on coding courses,
                  real-world projects, and industry-ready skills. Transform your
                  career with our comprehensive learning platform.
                </p>
              </div>
            </div>

            <div className="flex md:flex-row flex-col items-start md:items-center justify-center gap-10 md:gap-40">
              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 relative">
                  <span className="relative z-10">Quick Links</span>
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-yellow-400"></div>
                </h3>
                <ul className="space-y-3">
                  {[
                    { label: "All Courses", href: "/all-courses" },
                    { label: "Project Gallery", href: "/projects" },
                    { label: "Student Stories", href: "/testimonials" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-gray-500 rounded-full mr-3 group-hover:bg-primary transition-colors"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 relative">
                  <span className="relative z-10">Support</span>
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-yellow-400"></div>
                </h3>
                <ul className="space-y-3">
                  {[
                    { label: "Help Center", href: "/help" },
                    { label: "Community Forum", href: "/community" },
                    { label: "Contact Support", href: "/support" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-1 h-1 bg-gray-500 rounded-full mr-3 group-hover:bg-primary transition-colors"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700/30 bg-[#0A091A]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="text-gray-400 text-center lg:text-left">
                <p className="mb-2">
                  &copy; {new Date().getFullYear()} Code Learner. All rights
                  reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm mr-2">Follow us:</span>
                <div className="flex gap-3">
                  {[
                    {
                      name: "GitHub",
                      href: "https://github.com/devsafix",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                      ),
                    },
                    {
                      name: "LinkedIn",
                      href: "https://www.linkedin.com/in/devsafix/",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                        </svg>
                      ),
                    },

                    {
                      name: "Discord",
                      href: "https://discord.com/users/devsafix",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"></path>
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <Link
                      key={social.name}
                      to={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-10 h-10 bg-gray-700/30 hover:bg-gradient-to-r hover:from-primary/20 hover:to-yellow-500/20 border border-gray-600/50 hover:border-primary/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110 group"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Made with love */}
            <div className="mt-6 pt-6 border-t border-gray-700/20 text-center">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <span>Made with</span>
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>by Kawser, for developers</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
