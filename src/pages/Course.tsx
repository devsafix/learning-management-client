/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCourseQuery } from "@/redux/features/course/course.api";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Database,
  Atom,
  Layout,
  Palette,
  Server,
  Box,
  Sparkles,
  MoveRight,
} from "lucide-react";

export default function Course() {
  const { data } = useGetAllCourseQuery(undefined);

  const courses = data?.data || [];

  return (
    <section className="background-image py-32 md:pt-36">
      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 text-center space-y-3 mb-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
          Courses That Take You From{" "}
          <span className="text-primary">Learning</span> to{" "}
          <span className="text-green-400">Doing</span>
        </h1>
        <p className="text-muted-foreground">
          Learn the skills. Build the portfolio. Get the job.
        </p>
        {/* Technology icons */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 text-4xl">
          <Code2 className="text-yellow-400" /> {/* JavaScript */}
          <Database className="text-green-500" /> {/* MongoDB */}
          <Atom className="text-sky-400" /> {/* React */}
          <Layout className="text-white" /> {/* Next.js */}
          <Palette className="text-cyan-400" /> {/* TailwindCSS */}
          <Server className="text-green-600" /> {/* Node.js */}
          <Box className="text-purple-500" /> {/* Three.js */}
          <Sparkles className="text-green-400" /> {/* GSAP */}
        </div>

        {/* Small note */}
        <div className="text-center text-sm text-yellow-400 mb-10">
          ⚠️ No need to filter. Every course takes you from beginner to
          advanced, step by step.
        </div>
      </div>

      {/* All courses */}
      <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <div
              key={course._id}
              className="group relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] border border-gray-700/30 rounded-2xl shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative z-10">
                {/* Image container with overlay effects */}
                <div className="relative overflow-hidden mb-6 group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="space-y-4 p-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 leading-tight">
                    {course.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-4 border-t border-gray-700/30">
                  <Link to={`/course-details/${course.slug}`} className="block">
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-primary/20 to-yellow-500/20 hover:from-primary/30 hover:to-yellow-500/30 border border-primary/30 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 cursor-pointer"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Explore Course</span>
                        <MoveRight />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Bottom glow effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
