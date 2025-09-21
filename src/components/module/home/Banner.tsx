import { Button } from "@/components/ui/button";
import { Monitor, Users, Headphones, CreditCard, BookOpen } from "lucide-react";
import video from "../../../assets/video/intro-video.mp4";

export default function Banner() {
  return (
    <section className="relative min-h-screen flex items-center background-image">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 pt-32 md:py-20">
        {/* Left Content */}
        <div className="space-y-6 text-white">
          <h1 className="text-3xl md:text-[40px] font-bold leading-tight">
            Join <span className="text-primary">1,000,000+</span> Developers
            <br /> Around the Globe
          </h1>
          <p className="md:text-md text-white/80">
            The no.1 platform to go from beginner to advanced developer.
          </p>

          <ul className="space-y-4 text-white/80 text-sm md:text-base">
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 mt-1 text-primary" />
              <span>Access all courses + exclusive projects with Adrian</span>
            </li>
            <li className="flex items-start gap-3">
              <Monitor className="w-5 h-5 mt-1 text-primary" />
              <span>New lessons & tools added regularly</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-1 text-primary" />
              <span>Join thousands of devs leveling up globally</span>
            </li>
            <li className="flex items-start gap-3">
              <Headphones className="w-5 h-5 mt-1 text-primary" />
              <span>Practice with our Mock AI Interviewer</span>
            </li>
            <li className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 mt-1 text-primary" />
              <span>30-day money-back guarantee</span>
            </li>
          </ul>

          <Button size="lg" className="rounded-md font-semibold">
            Join JS Mastery Pro →
          </Button>
        </div>

        {/* Right Video */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl aspect-video overflow-hidden">
            <video
              controls
              poster="https://via.placeholder.com/800x450?text=Course+Preview"
              className="w-full h-full object-cover rounded-lg"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
