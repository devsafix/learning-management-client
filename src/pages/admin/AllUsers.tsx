/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  type User,
  type UserUpdatePayload,
} from "@/redux/features/user/user.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";

interface EditUser {
  _id: string;
  name: string;
  phone: string;
  address: string;
  role: "admin" | "user";
  isVerified: boolean;
}

export default function AllUsers() {
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: currentUserData } = useGetMeQuery(undefined);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const [editUser, setEditUser] = useState<EditUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "blocked"
  >("all");

  if (usersLoading) {
    return <div className="py-20 text-center">Loading users...</div>;
  }

  const users: User[] = usersData?.data || [];
  const currentUser: User | undefined = currentUserData?.data;

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.phone.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.isBlocked).length;
  const blockedUsers = users.filter((user) => user.isBlocked).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const verifiedUsers = users.filter((user) => user.isVerified).length;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Validate form
  const validateUserData = (userData: EditUser) => {
    if (!userData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!userData.phone.trim()) {
      toast.error("Phone is required");
      return false;
    }
    if (!userData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    return true;
  };

  // Handle Update User
  const handleUpdate = async () => {
    if (!editUser) return;

    if (!validateUserData(editUser)) return;

    try {
      const updatePayload: UserUpdatePayload = {
        name: editUser.name.trim(),
        phone: editUser.phone.trim(),
        address: editUser.address.trim(),
        role: editUser.role,
        isVerified: editUser.isVerified,
      };

      await updateUser({
        id: editUser._id,
        body: updatePayload,
      }).unwrap();

      toast.success("User updated successfully");
      setEditUser(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error("Update user error:", err);
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  // Handle Block User
  const handleBlock = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to block ${userName}?`)) return;

    // Prevent blocking yourself
    if (currentUser && userId === currentUser._id) {
      toast.error("You cannot block yourself");
      return;
    }

    try {
      await blockUser(userId).unwrap();
      toast.success("User blocked successfully");
    } catch (err: any) {
      console.error("Block user error:", err);
      toast.error(err?.data?.message || "Failed to block user");
    }
  };

  // Handle Unblock User
  const handleUnblock = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to unblock ${userName}?`)) return;

    try {
      await unblockUser(userId).unwrap();
      toast.success("User unblocked successfully");
    } catch (err: any) {
      console.error("Unblock user error:", err);
      toast.error(err?.data?.message || "Failed to unblock user");
    }
  };

  // Handle Edit Click
  const handleEditClick = (user: User) => {
    setEditUser({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isVerified: user.isVerified,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all users in the system
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 my-6">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Blocked Users</p>
              <p className="text-2xl font-bold">{blockedUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Administrators</p>
              <p className="text-2xl font-bold">{adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold">{verifiedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search users by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <select
          className="border rounded p-2 min-w-[120px]"
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value as "all" | "admin" | "user")
          }
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          className="border rounded p-2 min-w-[120px]"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "active" | "blocked")
          }
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchTerm || filterRole !== "all" || filterStatus !== "all"
              ? "No users found matching your filters."
              : "No users found."}
          </p>
        </div>
      ) : (
        /* Users Table */
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">User Info</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Role & Status</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {user.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span
                          className="max-w-[150px] truncate"
                          title={user.address}
                        >
                          {user.address}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className="w-fit"
                      >
                        {user.role === "admin" && (
                          <Shield className="h-3 w-3 mr-1" />
                        )}
                        {user.role}
                      </Badge>
                      <Badge
                        variant={user.isBlocked ? "destructive" : "outline"}
                        className="w-fit"
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      {/* Edit User */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(user)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Block/Unblock User */}
                      {user.isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblock(user._id, user.name)}
                          disabled={isUnblocking}
                          className="text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlock(user._id, user.name)}
                          disabled={
                            isBlocking ||
                            (currentUser && user._id === currentUser._id)
                          }
                          title={
                            currentUser && user._id === currentUser._id
                              ? "Cannot block yourself"
                              : "Block user"
                          }
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="flex flex-col gap-4 mt-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  placeholder="User full name"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  placeholder="Phone number"
                  value={editUser.phone}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  placeholder="User address"
                  className="w-full border rounded p-2 min-h-[80px] resize-vertical"
                  value={editUser.address}
                  onChange={(e) =>
                    setEditUser({ ...editUser, address: e.target.value })
                  }
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded p-2"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={editUser.isVerified}
                  onChange={(e) =>
                    setEditUser({ ...editUser, isVerified: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="isVerified" className="text-sm font-medium">
                  Verified User
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? "Updating..." : "Update User"}
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
