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

export default function AllCategory() {
  const { data, isLoading } = useGetCategoriesQuery({});

  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="py-20 text-center">Loading categories...</div>;
  }

  const categories = data?.data || [];

  // Add new category
  const handleAdd = async () => {
    try {
      await addCategory({ name: newName }).unwrap();
      toast.success("Category added");
      setIsAddDialogOpen(false);
      setNewName("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add category");
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <section className="py-10 w-full px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className=" text-2xl md:text-3xl font-bold">All Categories</h1>

        {/* Add Category Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Category name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button onClick={handleAdd}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Table */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Slug</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat: any) => (
            <tr key={cat._id} className="border-t">
              <td className="p-3">{cat.name}</td>
              <td className="p-3">{cat.slug}</td>
              <td className="p-3 flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cat._id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
