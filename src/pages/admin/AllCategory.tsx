/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/category/category.api";
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
import {
  Plus,
  Trash2,
  FolderOpen,
  Hash,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default function AllCategory() {
  const { data, isLoading } = useGetCategoriesQuery({});

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Loading Categories
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we fetch your categories...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = data?.data || [];

  // Add new category
  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await addCategory({ name: newName.trim() }).unwrap();
      toast.success("Category added successfully");
      setIsAddDialogOpen(false);
      setNewName("");
    } catch (err: any) {
      console.error("Add category error:", err);
      toast.error(err?.data?.message || "Failed to add category");
    }
  };

  // Delete category
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" category?`)) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (err: any) {
      console.error("Delete category error:", err);
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-slate-100 dark:via-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Organize your courses with categories
              </p>
            </div>

            {/* Add Category Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                  <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Add New Category
                  </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category Name
                      </label>
                      <Input
                        placeholder="Enter category name..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="h-11"
                        disabled={isAdding}
                      />
                      {newName && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Slug will be generated automatically:{" "}
                          {newName.toLowerCase().replace(/\s+/g, "-")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                    <Button
                      onClick={handleAdd}
                      disabled={isAdding || !newName.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-11"
                    >
                      {isAdding ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Add Category
                        </div>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setNewName("");
                      }}
                      className="flex-1 h-11"
                      disabled={isAdding}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Categories
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {categories.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Categories
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {categories.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Most Recent
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                    {categories.length > 0
                      ? categories[categories.length - 1]?.name
                      : "None"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {categories.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No categories found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Create your first category to organize your courses
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Category
              </Button>
            </div>
          </div>
        ) : (
          /* Categories Table */
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category Name
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Slug
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat: any, index: number) => (
                    <tr
                      key={cat._id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-800"
                          : "bg-slate-25 dark:bg-slate-800/30"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-slate-900 dark:text-slate-100 truncate"
                              title={cat.name}
                            >
                              {cat.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Category #{index + 1}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <code className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-mono bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            {cat.slug}
                          </code>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(cat._id, cat.name)}
                            disabled={isDeleting}
                            className="h-8 px-3 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 border-red-200 dark:border-red-800"
                          >
                            {isDeleting ? (
                              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Remove</span>
                              </div>
                            )}
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
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Showing {categories.length}{" "}
                  {categories.length === 1 ? "category" : "categories"}
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
