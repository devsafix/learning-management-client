/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/redux/features/course/course.api";

import { useGetCategoriesQuery } from "@/redux/features/category/category.api";

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

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  level: "beginner" | "intermediate" | "advanced";
  categoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  thumbnail: string;
  totalLessons: number;
  enrolledCount: number;
  averageRating: number;
}

interface Category {
  _id: string;
  name: string;
}

interface NewCourse {
  title: string;
  description: string;
  price: string;
  discount: string;
  level: "beginner" | "intermediate" | "advanced";
  categoryId: string;
  thumbnail: string;
}

export default function AllCourse() {
  const { data, isLoading } = useGetAllCourseQuery(undefined);
  const { data: categoriesData } = useGetCategoriesQuery({});

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: "",
    description: "",
    price: "",
    discount: "0",
    level: "beginner",
    categoryId: "",
    thumbnail: "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="py-20 text-center">Loading courses...</div>;
  }

  const courses: Course[] = data?.data || [];
  const categories: Category[] = categoriesData?.data || [];

  // Reset form
  const resetNewCourseForm = () => {
    setNewCourse({
      title: "",
      description: "",
      price: "",
      discount: "0",
      level: "beginner",
      categoryId: "",
      thumbnail: "",
    });
  };

  // Validate form
  const validateCourseData = (courseData: any) => {
    if (!courseData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!courseData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!courseData.categoryId) {
      toast.error("Category is required");
      return false;
    }
    if (!courseData.thumbnail.trim()) {
      toast.error("Thumbnail URL is required");
      return false;
    }
    if (!courseData.price || Number(courseData.price) < 0) {
      toast.error("Valid price is required");
      return false;
    }
    return true;
  };

  // Handle Add Course
  const handleAdd = async () => {
    if (!validateCourseData(newCourse)) return;

    try {
      const coursePayload = {
        title: newCourse.title.trim(),
        description: newCourse.description.trim(),
        price: Number(newCourse.price),
        discount: Number(newCourse.discount),
        level: newCourse.level,
        categoryId: newCourse.categoryId,
        thumbnail: newCourse.thumbnail.trim(),
      };

      await createCourse(coursePayload).unwrap();
      toast.success("Course created successfully");
      resetNewCourseForm();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("Create course error:", err);
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  // Handle Update Course
  const handleUpdate = async () => {
    if (!editCourse || !editId) return;

    const courseToUpdate = {
      title: editCourse.title.trim(),
      description: editCourse.description.trim(),
      price: Number(editCourse.price),
      discount: Number(editCourse.discount),
      level: editCourse.level,
      categoryId:
        typeof editCourse.categoryId === "object"
          ? editCourse.categoryId._id
          : editCourse.categoryId,
      thumbnail: editCourse.thumbnail.trim(),
      totalLessons: Number(editCourse.totalLessons) || 0,
    };

    if (!validateCourseData(courseToUpdate)) return;

    try {
      await updateCourse({
        id: editId,
        body: courseToUpdate,
      }).unwrap();
      toast.success("Course updated successfully");
      setEditId(null);
      setEditCourse(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error("Update course error:", err);
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  // Handle Delete Course
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
    } catch (err: any) {
      console.error("Delete course error:", err);
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  // Handle Edit Click
  const handleEditClick = (course: Course) => {
    setEditId(course._id);
    setEditCourse({ ...course });
    setIsEditDialogOpen(true);
  };

  return (
    <section className="py-10 w-full px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Courses</h1>

        {/* Add Course Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
              />
              <textarea
                placeholder="Course Description"
                className="border rounded p-2 min-h-[80px] resize-vertical"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
              <Input
                placeholder="Thumbnail URL"
                value={newCourse.thumbnail}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, thumbnail: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                />
                <Input
                  placeholder="Discount (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={newCourse.discount}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, discount: e.target.value })
                  }
                />
              </div>
              <select
                className="border rounded p-2"
                value={newCourse.level}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    level: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                className="border rounded p-2"
                value={newCourse.categoryId}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, categoryId: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAdd}
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? "Creating..." : "Create Course"}
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

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No courses found. Create your first course!
          </p>
        </div>
      ) : (
        /* Courses Table */
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-left">Lessons</th>
                <th className="p-3 text-left">Enrolled</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-t">
                  <td className="p-3 max-w-xs truncate" title={course.title}>
                    {course.title}
                  </td>
                  <td className="p-3">
                    {typeof course.categoryId === "object"
                      ? course.categoryId.name
                      : "N/A"}
                  </td>
                  <td className="p-3">${course.price}</td>
                  <td className="p-3 capitalize">{course.level}</td>
                  <td className="p-3">{course.totalLessons}</td>
                  <td className="p-3">{course.enrolledCount}</td>
                  <td className="p-3">{course.averageRating.toFixed(1)}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      {/* Edit Course */}
                      <Button
                        size="sm"
                        onClick={() => handleEditClick(course)}
                        disabled={isUpdating}
                      >
                        Edit
                      </Button>

                      {/* Delete Course */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(course._id)}
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

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editCourse && (
            <div className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="Course Title"
                value={editCourse.title}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Course Description"
                className="border rounded p-2 min-h-[80px] resize-vertical"
                value={editCourse.description}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    description: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Thumbnail URL"
                value={editCourse.thumbnail}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    thumbnail: e.target.value,
                  })
                }
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  value={editCourse.price}
                  onChange={(e) =>
                    setEditCourse({
                      ...editCourse,
                      price: Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Discount (%)"
                  min="0"
                  max="100"
                  value={editCourse.discount}
                  onChange={(e) =>
                    setEditCourse({
                      ...editCourse,
                      discount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <select
                className="border rounded p-2"
                value={editCourse.level}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    level: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                className="border rounded p-2"
                value={
                  typeof editCourse.categoryId === "object"
                    ? editCourse.categoryId._id
                    : editCourse.categoryId
                }
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    categoryId: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? "Updating..." : "Update Course"}
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
