import { Button } from "@/components/ui/button";
import { PlayCircle, Zap } from "lucide-react";
import { useState } from "react";
import video from "../../../assets/video/intro-video.mp4";
import { Link } from "react-router";

export default function Banner() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section className="relative min-h-screen flex items-center background-image">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 pt-32 pb-10 md:pb-0 md:py-20 z-10">
        {/* Left Content */}
        <div className="space-y-8 text-white">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary font-medium text-sm backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              Transform Your Career
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Master Skills,
              <br />
              <span className="text-transparent bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text">
                Build Dreams
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-lg">
              Join thousands of learners advancing their careers with our
              comprehensive online courses and hands-on projects.
            </p>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Learn at your own pace with lifetime access to course
                  materials
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Build real-world projects and create an impressive portfolio
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Get personalized feedback from industry professionals
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Join a supportive community of learners and mentors</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to={"/all-courses"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Start Learning Today
              </Button>
            </Link>
            <Link to={"/register"}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:text-white bg-white/10 hover:bg-white/5 backdrop-blur-sm font-semibold px-8 py-3 rounded-full cursor-pointer"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Video Section */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-2xl aspect-video relative overflow-hidden rounded-2xl shadow-2xl">
            {!isVideoPlaying ? (
              // Video Thumbnail/Placeholder
              <div
                className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer group"
                onClick={handlePlayVideo}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      Get Access To
                    </h3>
                    <p className="text-lg text-white/80">
                      Premium Learning Experience
                    </p>
                  </div>

                  {/* Play Button */}
                  <button className="relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-5 h-5 md:w-20 md:h-20 bg-gradient-to-r from-primary to-primary/90 rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary/25 transition-all duration-300">
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </div>
                  </button>

                  <p className="text-sm text-white/60">
                    Click to watch our introduction
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-white/50 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-1000"></div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-primary/50 transition-colors duration-300"></div>
              </div>
            ) : (
              // Actual Video Player
              <video
                controls
                autoPlay
                className="w-full h-full object-cover rounded-2xl"
                onEnded={() => setIsVideoPlaying(false)}
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Video Frame Enhancement */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl -z-10 blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-bounce delay-700 hidden lg:block"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-300 hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-primary/20 rounded-full animate-ping delay-1000 hidden lg:block"></div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </section>
  );
}
