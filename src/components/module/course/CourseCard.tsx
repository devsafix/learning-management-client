import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define a type for your course data
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPopular?: boolean; // Optional field for the 'Most Popular' badge
  // Add other course properties as needed
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div
      className="p-6 rounded-xl relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
      style={{
        // A placeholder for the background design from the image
        background: course.isPopular
          ? "linear-gradient(135deg, #1A1A2E 0%, #100F2A 100%)" // Darker variant for popular
          : "linear-gradient(135deg, #2A2A4A 0%, #1A1A3A 100%)", // Standard dark background
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Thumbnail/Image and Popular Badge */}
      <div className="flex justify-between items-start mb-4">
        {course.isPopular && (
          <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 text-xs">
            🔥 Most Popular
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 leading-snug">
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6 line-clamp-3">
        {course.description}
      </p>

      {/* Check it now Button/Link */}
      <Link
        to={`/course-details/${course._id}`}
        className="flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm group"
      >
        Check it now
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default CourseCard;
