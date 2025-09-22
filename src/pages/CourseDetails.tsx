import { useParams } from "react-router";
import { useGetCourseBySlugQuery } from "@/redux/features/course/course.api";
import { Button } from "@/components/ui/button";

export default function CourseDetails() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetCourseBySlugQuery(slug as string);

  if (isLoading) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        Loading course details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 text-center text-red-500">
        Failed to load course details.
      </div>
    );
  }

  const course = data?.data;

  console.log(course.categoryId);

  if (!course) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-32 md:pt-36">
      {/* Course Thumbnail */}
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-72 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Course Info */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          <p className="text-white/90">{course.description}</p>

          {/* Category & Instructor */}
          <div className="mt-4 space-y-1">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {course.categoryId?.name}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Instructor:</span>{" "}
              {course.instructorId?.name}
            </p>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-md">
              Level: {course.level}
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md">
              Lessons: {course.totalLessons}
            </span>
            <span className="px-4 py-2 bg-sky-500/20 text-sky-400 rounded-md">
              Enrolled: {course.enrolledCount}
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md">
              Created: {new Date(course.createdAt).toLocaleDateString()}
            </span>
            <span className="text-sm line-through ml-2">{course.discount}</span>
          </div>

          {/* Price */}
          <div className="text-2xl font-semibold mt-4">
            💲 {course.price - (course.discount || 0)}{" "}
            {course.discount > 0 && (
              <span className="text-sm line-through ml-2">{course.price}</span>
            )}
          </div>

          {/* Enroll Button */}
          <Button size="lg" className="mt-6 w-full md:w-auto cursor-pointer">
            Enroll Now →
          </Button>
        </div>
      </div>
    </section>
  );
}
