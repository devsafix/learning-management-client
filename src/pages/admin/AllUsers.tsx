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
  Edit3,
  Ban,
  CheckCircle,
  Search,
  Filter,
  UserCog,
  Clock,
  AlertCircle,
  Settings,
  Eye,
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-teal-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Loading Users
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we fetch user data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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

  const getRoleBadgeColor = (role: string) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
  };

  const getStatusBadgeColor = (isBlocked: boolean) => {
    return isBlocked
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 dark:from-slate-100 dark:via-teal-400 dark:to-slate-100 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and monitor all users in the system
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {activeUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Blocked Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {blockedUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Administrators
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {adminUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Verified
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {verifiedUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Role Filter */}
            <div className="relative min-w-[140px]">
              <select
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 pr-10 w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value as "all" | "admin" | "user")
                }
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <UserCog className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[140px]">
              <select
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 pr-10 w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "blocked"
                  )
                }
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Eye className="w-4 h-4" />
                  <span>
                    Showing {filteredUsers.length} of {totalUsers} users
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                    setFilterStatus("all");
                  }}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                {searchTerm ||
                filterRole !== "all" ||
                filterStatus !== "all" ? (
                  <Search className="w-10 h-10 text-slate-400" />
                ) : (
                  <Users className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {searchTerm || filterRole !== "all" || filterStatus !== "all"
                    ? "No users found"
                    : "No users available"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {searchTerm || filterRole !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Users will appear here when they register"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Users Table */
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        User Info
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Role & Status
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-800"
                          : "bg-slate-25 dark:bg-slate-800/30"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-full flex items-center justify-center flex-shrink-0">
                            {user.role === "admin" ? (
                              <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            ) : (
                              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                {user.name}
                              </p>
                              {user.isVerified && (
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-900 dark:text-slate-100">
                              {user.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span
                              className="max-w-[150px] truncate"
                              title={user.address}
                            >
                              {user.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role === "admin" && (
                              <Shield className="w-3 h-3 mr-1" />
                            )}
                            {user.role}
                          </div>
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              user.isBlocked
                            )}`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Edit User */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(user)}
                            disabled={isUpdating}
                            className="h-8 w-8 p-0 hover:bg-teal-50 hover:border-teal-200 dark:hover:bg-teal-900/20"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>

                          {/* Block/Unblock User */}
                          {user.isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblock(user._id, user.name)}
                              disabled={isUnblocking}
                              className="h-8 w-8 p-0 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20 text-emerald-600 hover:text-emerald-700"
                            >
                              <UserCheck className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlock(user._id, user.name)}
                              disabled={
                                isBlocking ||
                                (currentUser && user._id === currentUser._id)
                              }
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                currentUser && user._id === currentUser._id
                                  ? "Cannot block yourself"
                                  : "Block user"
                              }
                            >
                              {isBlocking ? (
                                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Ban className="w-3 h-3" />
                              )}
                            </Button>
                          )}
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
                    Showing {filteredUsers.length}{" "}
                    {filteredUsers.length === 1 ? "user" : "users"}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>{activeUsers} active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{blockedUsers} blocked</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Last updated {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Edit User
              </DialogTitle>
            </DialogHeader>
            {editUser && (
              <div className="py-6">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter user's full name"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <Input
                      placeholder="Enter phone number"
                      value={editUser.phone}
                      onChange={(e) =>
                        setEditUser({ ...editUser, phone: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <textarea
                      placeholder="Enter user address"
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 min-h-[80px] resize-vertical bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      value={editUser.address}
                      onChange={(e) =>
                        setEditUser({ ...editUser, address: e.target.value })
                      }
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      User Role
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 h-11 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
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
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={editUser.isVerified}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          isVerified: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-teal-600 bg-slate-100 border-slate-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <label
                      htmlFor="isVerified"
                      className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Verified User
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-8 border-t border-slate-200 dark:border-slate-700 mt-8">
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-11"
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update User"
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
