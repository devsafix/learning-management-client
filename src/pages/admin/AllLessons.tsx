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
import { Play, Clock, FileText, Plus, Minus } from "lucide-react";
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
    return <div className="py-20 text-center">Loading lessons...</div>;
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

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Lessons</h1>
          <p className="text-muted-foreground mt-1">
            Manage lessons across all courses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Course Filter */}
          <select
            className="border rounded p-2 min-w-[200px]"
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

          {/* Add Lesson Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Lesson</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course
                  </label>
                  <select
                    className="w-full border rounded p-2"
                    value={newLesson.courseId}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, courseId: e.target.value })
                    }
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lesson Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lesson Title
                  </label>
                  <Input
                    placeholder="Enter lesson title"
                    value={newLesson.title}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, title: e.target.value })
                    }
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Video URL
                  </label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={newLesson.videoUrl}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, videoUrl: e.target.value })
                    }
                  />
                </div>

                {/* Duration and Order */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Duration (seconds)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="3600"
                      value={newLesson.duration}
                      onChange={(e) =>
                        setNewLesson({ ...newLesson, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Order
                    </label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={newLesson.order}
                      onChange={(e) =>
                        setNewLesson({ ...newLesson, order: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resources (Optional)
                  </label>
                  {newLesson.resources.map((resource, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="https://example.com/resource.pdf"
                        value={resource}
                        onChange={(e) =>
                          handleResourceChange(index, e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResource(index)}
                        disabled={newLesson.resources.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addResource()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Resource
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleAdd}
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? "Creating..." : "Create Lesson"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
              <p className="text-2xl font-bold">{filteredLessons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="text-2xl font-bold">
                {formatDuration(
                  filteredLessons.reduce(
                    (acc, lesson) => acc + lesson.duration,
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {selectedCourse === "all"
              ? "No lessons found. Create your first lesson!"
              : "No lessons found for selected course."}
          </p>
        </div>
      ) : (
        /* Lessons Table */
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Resources</th>
                <th className="p-3 text-left">Video</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map((lesson) => (
                <tr key={lesson?._id} className="border-t">
                  <td className="p-3">
                    <Badge variant="outline">#{lesson.order}</Badge>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate" title={lesson.title}>
                      {lesson.title}
                    </div>
                  </td>
                  <td className="p-3">{formatDuration(lesson.duration)}</td>
                  <td className="p-3">
                    <Badge variant="secondary">
                      {lesson.resources.length} files
                    </Badge>
                  </td>
                  <td className="p-3">
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Watch
                    </a>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleEditClick(lesson)}
                        disabled={isUpdating}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lesson._id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Lesson Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          {editLesson && (
            <div className="flex flex-col gap-4 mt-4">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  className="w-full border rounded p-2"
                  value={editLesson.courseId}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, courseId: e.target.value })
                  }
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lesson Title
                </label>
                <Input
                  value={editLesson.title}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, title: e.target.value })
                  }
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video URL
                </label>
                <Input
                  value={editLesson.videoUrl}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, videoUrl: e.target.value })
                  }
                />
              </div>

              {/* Duration and Order */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editLesson.duration}
                    onChange={(e) =>
                      setEditLesson({
                        ...editLesson,
                        duration: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Order
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={editLesson.order}
                    onChange={(e) =>
                      setEditLesson({
                        ...editLesson,
                        order: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Resources */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resources
                </label>
                {editLesson.resources.map((resource, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={resource}
                      onChange={(e) =>
                        handleResourceChange(index, e.target.value, true)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeResource(index, true)}
                      disabled={editLesson.resources.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addResource(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? "Updating..." : "Update Lesson"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
