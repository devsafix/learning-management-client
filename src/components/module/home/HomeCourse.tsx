/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/HomeCourse.tsx
import { Link } from "react-router";
import { useGetAllCourseQuery } from "@/redux/features/course/course.api";
import { Button } from "@/components/ui/button";

export default function HomeCourse() {
  // Fetch data
  const { data, isLoading, isError } = useGetAllCourseQuery(undefined);

  // Use the fetched data or the mock data for structure
  const courses = data?.data.slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-[#0A091A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          Loading courses...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A091A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-red-500">
          Error loading courses.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A091A] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Stop Watching. <span className="text-primary">Start Building.</span>
          </h2>
          <p className="mt-3 text-lg text-gray-400">
            Full stack courses focused on outcomes, not watch time.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* --- */}

        {/* View All Courses Button */}
        <div className="mt-12 text-center">
          <Link to="/all-courses">
            <Button
              size="lg"
              className="rounded-md font-semibold cursor-pointer"
            >
              View All Courses →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
