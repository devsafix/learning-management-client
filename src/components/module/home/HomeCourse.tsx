/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/HomeCourse.tsx
import { Link } from "react-router";
import { useGetAllCourseQuery } from "@/redux/features/course/course.api";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function HomeCourse() {
  // Fetch data
  const { data, isLoading, isError } = useGetAllCourseQuery(undefined);

  // Use the fetched data or the mock data for structure
  const courses = data?.data.slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-[#0A091A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A091A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-500">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 inline-block">
            <span className="text-lg font-medium">Error loading courses.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#0A091A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Stop Watching.{" "}
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Start Building.
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Full stack courses focused on outcomes, not watch time.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-primary to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses &&
            courses?.map((course: any) => (
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
                    <Link
                      to={`/course-details/${course.slug}`}
                      className="block"
                    >
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

        {/* View All Courses Button */}
        <div className="mt-16 text-center">
          <Link to="/all-courses">
            <Button
              size="lg"
              className="relative px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group cursor-pointer"
            >
              <span>View All Courses</span>

              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
