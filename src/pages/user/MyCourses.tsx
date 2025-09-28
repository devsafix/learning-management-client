import {
  useGetMyCoursesQuery,
  type EnrolledCourse,
} from "@/redux/features/user/user.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Calendar,
  Star,
  User,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function MyCourses() {
  const { data: myCoursesData, isLoading, error } = useGetMyCoursesQuery();
  const navigate = useNavigate();

  const enrolledCourses: EnrolledCourse[] = myCoursesData?.data || [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle view videos
  const handleViewVideos = (courseId: string) => {
    navigate(`/my-videos/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load courses
              </h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-muted-foreground">
                Continue your learning journey
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrolledCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Learning
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      enrolledCourses.filter(
                        (course) => course.status === "ENROLLED"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Invested
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      enrolledCourses.reduce(
                        (acc, course) => acc + (course.course.price || 0),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your learning journey by enrolling in your first course.
              Discover new skills and advance your career.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Course Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <Badge
                        variant={
                          enrollment.status === "ENROLLED"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {enrollment.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(enrollment.course.price)}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {enrollment.course.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {enrollment.course.description}
                  </p>
                </div>

                {/* Course Details */}
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Enrolled {formatDate(enrollment.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        by Instructor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      0%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                      style={{ width: `0%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  <Button
                    onClick={() => handleViewVideos(enrollment.course._id)}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/all-courses")}
              className="flex items-center gap-2 h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Browse More Courses</p>
                <p className="text-xs text-muted-foreground">
                  Discover new skills
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/certificates")}
              className="flex items-center gap-2 h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20"
            >
              <Star className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">View Certificates</p>
                <p className="text-xs text-muted-foreground">
                  See your achievements
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/user/my-profile")}
              className="flex items-center gap-2 h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/20"
            >
              <User className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">Update Profile</p>
                <p className="text-xs text-muted-foreground">
                  Manage your account
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
