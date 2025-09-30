/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router";
import {
  useEnrollCourseMutation,
  useGetCourseBySlugQuery,
} from "@/redux/features/course/course.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  Users,
  BookOpen,
  Play,
  Award,
  Calendar,
  User,
  Tag,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useGetLessonsByCourseQuery } from "@/redux/features/lesson/lesson.api";
import {
  useGetMyCoursesQuery,
  type EnrolledCourse,
} from "@/redux/features/user/user.api";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";

export default function CourseDetails() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetCourseBySlugQuery(slug as string);
  const [enrollCourse, { isLoading: enrolling }] = useEnrollCourseMutation();

  const course = data?.data;

  const { data: myCoursesData } = useGetMyCoursesQuery();

  const { data: userData } = useGetMeQuery(undefined);
  const user = userData?.data;

  const enrolledCourses: EnrolledCourse[] = myCoursesData?.data || [];

  const haveEnrolled = enrolledCourses?.find(
    (ec) => ec.course._id === course?._id
  );

  const handleEnroll = async () => {
    try {
      const res = await enrollCourse({ courseId: course._id }).unwrap();

      if (res?.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error("Failed to initialize payment.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Enrollment failed");
    }
  };

  // fetch lessons when course is available
  const { data: lessonsData, isLoading: lessonLoading } =
    useGetLessonsByCourseQuery(course?._id, {
      skip: !course?._id,
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-300 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]  flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-6xl">⚠️</div>
          <p className="text-red-400 text-xl">Failed to load course details.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]  flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-slate-400 text-6xl">🔍</div>
          <p className="text-slate-300 text-xl">Course not found.</p>
        </div>
      </div>
    );
  }

  const discountedPrice = course.price - (course.discount || 0);
  const discountPercentage =
    course.discount > 0
      ? Math.round((course.discount / course.price) * 100)
      : 0;

  return (
    <div className="relative min-h-screen background-image">
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Hero Section with Background Pattern */}
      <div className="relative overflow-hidden">
        <section className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Course Thumbnail */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {course.categoryId?.name}
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-slate-300 text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Instructor Info */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="px-6 py-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Instructor</p>
                      <p className="text-lg font-semibold text-white">
                        {course.instructorId?.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Level</p>
                  <p className="font-semibold text-white">{course.level}</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Lessons</p>
                  <p className="font-semibold text-white">
                    {course.totalLessons}
                  </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Enrolled</p>
                  <p className="font-semibold text-white">
                    {course.enrolledCount}
                  </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center">
                  <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Created</p>
                  <p className="font-semibold text-white">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
                <CardContent className="px-6 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-white">
                          ${discountedPrice}
                        </span>
                        {course.discount > 0 && (
                          <>
                            <span className="text-lg text-slate-400 line-through">
                              ${course.price}
                            </span>
                            <Badge className="bg-red-500 text-white">
                              -{discountPercentage}%
                            </Badge>
                          </>
                        )}
                      </div>
                      <p className="text-slate-300 mt-1">One-time payment</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}

              {user ? (
                haveEnrolled ? (
                  <Button
                    size="lg"
                    disabled
                    className="w-full font-semibold py-4 text-lg cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Already Enrolled
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    disabled={enrolling}
                    onClick={handleEnroll}
                    className="w-full font-semibold py-4 text-lg cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {enrolling
                      ? "Processing..."
                      : "Enroll Now - Start Learning"}
                  </Button>
                )
              ) : (
                <Link to={"/login"}>
                  <Button
                    size="lg"
                    className="w-full font-semibold py-4 mb-4 text-lg cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Login To Enroll
                  </Button>
                </Link>
              )}

              <p className="text-center text-slate-400 text-sm">
                💰 30-day money-back guarantee • 🔄 Lifetime access
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="relative">
        {/* Course Curriculum Section */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Course Curriculum
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Comprehensive lessons designed to take you from beginner to expert
            </p>
          </div>

          {lessonLoading ? (
            <div className="flex justify-center items-center py-20 bg-transparent">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-300">Loading curriculum...</p>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {lessonsData?.data?.map((lesson: any, index: number) => (
                    <AccordionItem
                      key={lesson._id}
                      value={lesson._id}
                      className="border-slate-700/50"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-slate-700/30 transition-colors duration-200">
                        <div className="flex items-center space-x-4 text-left">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {lesson.order || index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">
                              {lesson.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{Math.floor(lesson.duration / 60)} min</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="ml-12 space-y-3">
                          <div className="flex items-center space-x-4 text-slate-300">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>
                                Duration: {Math.floor(lesson.duration / 60)}{" "}
                                minutes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Play className="w-4 h-4 text-green-400" />
                              <span>Video Lesson</span>
                            </div>
                          </div>
                          {lesson.description && (
                            <p className="text-slate-400 leading-relaxed">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Additional Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-700/50">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Lifetime Access
                </h3>
                <p className="text-slate-400">
                  Learn at your own pace with unlimited access to all course
                  materials
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Certificate
                </h3>
                <p className="text-slate-400">
                  Earn a certificate of completion to showcase your new skills
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Community
                </h3>
                <p className="text-slate-400">
                  Join thousands of learners and get support from our community
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
