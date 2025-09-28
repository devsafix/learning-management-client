import {
  useGetLessonsByCourseQuery,
  type Lesson,
} from "@/redux/features/lesson/lesson.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  Download,
  ChevronLeft,
  PlayCircle,
  CheckCircle,
  BookOpen,
  Monitor,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";

export default function MyVideos() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    data: lessonsData,
    isLoading,
    error,
  } = useGetLessonsByCourseQuery(courseId!);

  console.log(courseId);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  const lessons: Lesson[] = lessonsData?.data || [];
  const currentLesson = selectedLesson || lessons[0];

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Mark lesson as completed
  const markAsCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

  // Get next lesson
  const getNextLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = lessons.findIndex(
      (lesson) => lesson._id === currentLesson._id
    );
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  // Get video embed URL
  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error || !courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load course
          </h3>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => navigate("/user/my-courses")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No lessons available
          </h3>
          <p className="text-muted-foreground mb-4">
            This course doesn't have any lessons yet
          </p>
          <Button onClick={() => navigate("/my-courses")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/user/my-courses")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                My Courses
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentLesson?.courseId &&
                  typeof currentLesson.courseId === "object" &&
                  "title" in currentLesson.courseId
                    ? (currentLesson.courseId as { title: string }).title
                    : "Course Videos"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {lessons.length} lessons • {completedLessons.size}/
                  {lessons.length} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {Math.round((completedLessons.size / lessons.length) * 100)}%
                Complete
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Video Player */}
              <div className="relative bg-black aspect-video">
                {currentLesson ? (
                  <iframe
                    src={getVideoEmbedUrl(currentLesson.videoUrl)}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a lesson to start watching</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              {currentLesson && (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {currentLesson.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(currentLesson.duration)}
                        </div>
                        <Badge variant="outline">
                          Lesson #{currentLesson.order}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!completedLessons.has(currentLesson._id) ? (
                        <Button
                          onClick={() => markAsCompleted(currentLesson._id)}
                          size="sm"
                          variant="outline"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Resources */}
                  {currentLesson.resources &&
                    currentLesson.resources.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Resources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentLesson.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Download className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                Resource {index + 1}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      disabled={
                        lessons.findIndex(
                          (l) => l._id === currentLesson._id
                        ) === 0
                      }
                      onClick={() => {
                        const currentIndex = lessons.findIndex(
                          (l) => l._id === currentLesson._id
                        );
                        if (currentIndex > 0) {
                          setSelectedLesson(lessons[currentIndex - 1]);
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous Lesson
                    </Button>

                    <Button
                      disabled={!getNextLesson()}
                      onClick={() => {
                        const nextLesson = getNextLesson();
                        if (nextLesson) {
                          setSelectedLesson(nextLesson);
                        }
                      }}
                    >
                      Next Lesson
                      <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden sticky top-24">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-muted-foreground">
                  {lessons.length} lessons •{" "}
                  {lessons.reduce((acc, lesson) => acc + lesson.duration, 0) /
                    60}{" "}
                  minutes
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                      currentLesson?._id === lesson._id
                        ? "bg-primary/5 border-primary/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedLessons.has(lesson._id) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : currentLesson?._id === lesson._id ? (
                          <PlayCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {lesson.order}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm mb-1 line-clamp-2 ${
                            currentLesson?._id === lesson._id
                              ? "text-primary"
                              : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDuration(lesson.duration)}
                          {lesson.resources && lesson.resources.length > 0 && (
                            <>
                              <span>•</span>
                              <FileText className="h-3 w-3" />
                              {lesson.resources.length}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Progress
                  </span>
                  <span className="text-sm text-gray-600">
                    {completedLessons.size}/{lessons.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (completedLessons.size / lessons.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                {completedLessons.size === lessons.length && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Course Completed!
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Congratulations on completing all lessons
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
