/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  type Lesson,
  type LessonCreatePayload,
} from "@/redux/features/lesson/lesson.api";

import { useGetAllCourseQuery } from "@/redux/features/course/course.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  FileText,
  Plus,
  Minus,
  Edit3,
  Trash2,
  BookOpen,
  Video,
  Filter,
  Calendar,
  ExternalLink,
  Download,
} from "lucide-react";
import type { Course, NewLesson } from "@/types";

export default function AllLessons() {
  const { data: lessonsData, isLoading: lessonsLoading } =
    useGetAllLessonsQuery();
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCourseQuery(undefined);

  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  const [newLesson, setNewLesson] = useState<NewLesson>({
    courseId: "",
    title: "",
    videoUrl: "",
    duration: "0",
    resources: [""],
    order: "1",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  if (lessonsLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Loading Lessons
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we fetch your lessons...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lessons: Lesson[] = lessonsData?.data || [];
  const courses: Course[] = coursesData?.data || [];

  // Filter lessons based on selected course
  const filteredLessons =
    selectedCourse === "all"
      ? lessons
      : lessons.filter((lesson) => lesson.courseId === selectedCourse);

  // Reset form
  const resetNewLessonForm = () => {
    setNewLesson({
      courseId: "",
      title: "",
      videoUrl: "",
      duration: "0",
      resources: [""],
      order: "1",
    });
  };

  // Validate form
  const validateLessonData = (lessonData: any) => {
    if (!lessonData.courseId) {
      toast.error("Course selection is required");
      return false;
    }
    if (!lessonData.title.trim()) {
      toast.error("Lesson title is required");
      return false;
    }
    if (!lessonData.videoUrl.trim()) {
      toast.error("Video URL is required");
      return false;
    }
    if (Number(lessonData.duration) < 0) {
      toast.error("Duration must be a positive number");
      return false;
    }
    if (Number(lessonData.order) < 1) {
      toast.error("Order must be at least 1");
      return false;
    }
    return true;
  };

  // Handle Add Resource
  const addResource = (isEdit = false) => {
    if (isEdit && editLesson) {
      setEditLesson({
        ...editLesson,
        resources: [...editLesson.resources, ""],
      });
    } else {
      setNewLesson({
        ...newLesson,
        resources: [...newLesson.resources, ""],
      });
    }
  };

  // Handle Remove Resource
  const removeResource = (index: number, isEdit = false) => {
    if (isEdit && editLesson) {
      const updatedResources = editLesson.resources.filter(
        (_, i) => i !== index
      );
      setEditLesson({
        ...editLesson,
        resources: updatedResources.length > 0 ? updatedResources : [""],
      });
    } else {
      const updatedResources = newLesson.resources.filter(
        (_, i) => i !== index
      );
      setNewLesson({
        ...newLesson,
        resources: updatedResources.length > 0 ? updatedResources : [""],
      });
    }
  };

  // Handle Resource Change
  const handleResourceChange = (
    index: number,
    value: string,
    isEdit = false
  ) => {
    if (isEdit && editLesson) {
      const updatedResources = [...editLesson.resources];
      updatedResources[index] = value;
      setEditLesson({
        ...editLesson,
        resources: updatedResources,
      });
    } else {
      const updatedResources = [...newLesson.resources];
      updatedResources[index] = value;
      setNewLesson({
        ...newLesson,
        resources: updatedResources,
      });
    }
  };

  // Format duration for display
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

  // Handle Add Lesson
  const handleAdd = async () => {
    const lessonPayload: LessonCreatePayload = {
      courseId: newLesson.courseId,
      title: newLesson.title.trim(),
      videoUrl: newLesson.videoUrl.trim(),
      duration: Number(newLesson.duration),
      resources: newLesson.resources.filter(
        (resource) => resource.trim() !== ""
      ),
      order: Number(newLesson.order),
    };

    if (!validateLessonData(lessonPayload)) return;

    try {
      await createLesson(lessonPayload).unwrap();
      toast.success("Lesson created successfully");
      resetNewLessonForm();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("Create lesson error:", err);
      toast.error(err?.data?.message || "Failed to create lesson");
    }
  };

  // Handle Update Lesson
  const handleUpdate = async () => {
    if (!editLesson || !editId) return;

    const lessonPayload = {
      courseId: editLesson.courseId,
      title: editLesson.title.trim(),
      videoUrl: editLesson.videoUrl.trim(),
      duration: Number(editLesson.duration),
      resources: editLesson.resources.filter(
        (resource) => resource.trim() !== ""
      ),
      order: Number(editLesson.order),
    };

    if (!validateLessonData(lessonPayload)) return;

    try {
      await updateLesson({
        id: editId,
        body: lessonPayload,
      }).unwrap();
      toast.success("Lesson updated successfully");
      setEditId(null);
      setEditLesson(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error("Update lesson error:", err);
      toast.error(err?.data?.message || "Failed to update lesson");
    }
  };

  // Handle Delete Lesson
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(id).unwrap();
      toast.success("Lesson deleted successfully");
    } catch (err: any) {
      console.error("Delete lesson error:", err);
      toast.error(err?.data?.message || "Failed to delete lesson");
    }
  };

  // Handle Edit Click
  const handleEditClick = (lesson: Lesson) => {
    setEditId(lesson._id);
    setEditLesson({ ...lesson });
    setIsEditDialogOpen(true);
  };

  // Get selected course name
  const getSelectedCourseName = () => {
    if (selectedCourse === "all") return "All Courses";
    const course = courses.find((c) => c._id === selectedCourse);
    return course?.title || "Unknown Course";
  };

  const LessonFormFields = ({ lesson, setLesson, isEdit = false }: any) => (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Course
        </label>
        <select
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 h-11 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          value={isEdit ? lesson.courseId : lesson.courseId}
          onChange={(e) => setLesson({ ...lesson, courseId: e.target.value })}
        >
          {!isEdit && <option value="">Select Course</option>}
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Lesson Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Lesson Title
        </label>
        <Input
          placeholder="Enter lesson title..."
          value={lesson.title}
          onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
          className="h-11"
        />
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Video className="w-4 h-4" />
          Video URL
        </label>
        <Input
          placeholder="https://youtube.com/watch?v=..."
          value={lesson.videoUrl}
          onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })}
          className="h-11"
        />
      </div>

      {/* Duration and Order */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duration (seconds)
          </label>
          <Input
            type="number"
            min="0"
            placeholder="3600"
            value={isEdit ? lesson.duration : lesson.duration}
            onChange={(e) =>
              setLesson({
                ...lesson,
                duration: isEdit ? Number(e.target.value) : e.target.value,
              })
            }
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Order
          </label>
          <Input
            type="number"
            min="1"
            placeholder="1"
            value={isEdit ? lesson.order : lesson.order}
            onChange={(e) =>
              setLesson({
                ...lesson,
                order: isEdit ? Number(e.target.value) : e.target.value,
              })
            }
            className="h-11"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Resources (Optional)
        </label>
        <div className="space-y-2">
          {lesson.resources.map((resource: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/resource.pdf"
                value={resource}
                onChange={(e) =>
                  handleResourceChange(index, e.target.value, isEdit)
                }
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeResource(index, isEdit)}
                disabled={lesson.resources.length === 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addResource(isEdit)}
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 dark:from-slate-100 dark:via-green-400 dark:to-slate-100 bg-clip-text text-transparent">
                Lesson Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage lessons across all your courses
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Course Filter */}
              <div className="relative">
                <select
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 pr-10 min-w-[200px] focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Add Lesson Button */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Create New Lesson
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-6">
                    <LessonFormFields
                      lesson={newLesson}
                      setLesson={setNewLesson}
                    />
                    <div className="flex gap-3 pt-8 border-t border-slate-200 dark:border-slate-700 mt-8">
                      <Button
                        onClick={handleAdd}
                        disabled={isCreating}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-11"
                      >
                        {isCreating ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating...
                          </div>
                        ) : (
                          "Create Lesson"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          resetNewLessonForm();
                        }}
                        className="flex-1 h-11"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter Info */}
          {selectedCourse !== "all" && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Showing lessons from: {getSelectedCourseName()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCourse("all")}
                  className="ml-auto h-7 text-xs text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  Clear filter
                </Button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Lessons
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {filteredLessons.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Duration
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatDuration(
                      filteredLessons.reduce(
                        (acc, lesson) => acc + lesson.duration,
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Available Courses
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {courses.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredLessons.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {selectedCourse === "all"
                    ? "No lessons found"
                    : `No lessons found for ${getSelectedCourseName()}`}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedCourse === "all"
                    ? "Create your first lesson to get started"
                    : "Add lessons to this course to see them here"}
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Lesson
              </Button>
            </div>
          </div>
        ) : (
          /* Lessons Table */
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Order
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Lesson
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Resources
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson, index) => (
                    <tr
                      key={lesson?._id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-800"
                          : "bg-slate-25 dark:bg-slate-800/30"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-slate-50 dark:bg-slate-700"
                          >
                            #{lesson.order}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs"
                              title={lesson.title}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Lesson #{lesson.order}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {lesson.resources.length} files
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm hover:underline transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Watch
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(lesson)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(lesson._id)}
                            disabled={isDeleting}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>
                    Showing {filteredLessons.length}{" "}
                    {filteredLessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                  <span>
                    Total duration:{" "}
                    {formatDuration(
                      filteredLessons.reduce(
                        (acc, lesson) => acc + lesson.duration,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Lesson Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Edit Lesson
              </DialogTitle>
            </DialogHeader>
            {editLesson && (
              <div className="py-6">
                <LessonFormFields
                  lesson={editLesson}
                  setLesson={setEditLesson}
                  isEdit={true}
                />
                <div className="flex gap-3 pt-8 border-t border-slate-200 dark:border-slate-700 mt-8">
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-11"
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Lesson"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
