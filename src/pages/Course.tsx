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
} from "lucide-react";

export default function Course() {
  const { data } = useGetAllCourseQuery(undefined);

  const courses = data?.data || [];

  return (
    <section className="background-image py-32 md:pt-36">
      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 text-center space-y-3 mb-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
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
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">All Courses</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <div
              key={course._id}
              className="bg-[#0f0f1a] border border-yellow-500/40 rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-44 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                {course.description}
              </p>
              <Link to={`/course-details/${course.slug}`} className="mt-4">
                <Button variant="secondary" className="w-full cursor-pointer">
                  Check it now →
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
