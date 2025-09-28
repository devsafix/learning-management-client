import { useGetEarningsQuery } from "@/redux/features/admin/admin.api";
import { useGetAllUsersQuery } from "@/redux/features/user/user.api";
import { useGetAllCourseQuery } from "@/redux/features/course/course.api";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";

import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  TrendingUp,
  Users,
  BookOpen,
  Play,
  DollarSign,
  UserCheck,
  UserX,
  Award,
  ArrowUpIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Star,
  Target,
  Zap,
  TrendingDown,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  categoryId: {
    _id: string;
    name: string;
  };
  enrolledCount: number;
  averageRating: number;
  totalLessons: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function Analytics() {
  const { data: earningsData, isLoading: earningsLoading } =
    useGetEarningsQuery();

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCourseQuery(undefined);
  const { data: categoriesData } = useGetCategoriesQuery({});

  if (earningsLoading || usersLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Loading Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Please wait while we process your data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const users: User[] = usersData?.data || [];
  const courses: Course[] = coursesData?.data || [];
  const categories: Category[] = categoriesData?.data || [];
  const earnings = earningsData?.data;

  // Calculate statistics
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalCategories = categories.length;
  const totalLessons = courses.reduce(
    (acc, course) => acc + (course.totalLessons || 0),
    0
  );
  const activeUsers = users.filter((user) => !user.isBlocked).length;
  const blockedUsers = users.filter((user) => user.isBlocked).length;
  const verifiedUsers = users.filter((user) => user.isVerified).length;
  const totalRevenue = earnings?.totalRevenue || 0;
  const totalEnrollments = courses.reduce(
    (acc, course) => acc + (course.enrolledCount || 0),
    0
  );

  // Calculate growth rates (mock data for demo)
  const userGrowthRate = 12.5;
  const courseGrowthRate = 8.3;
  const revenueGrowthRate = 15.7;

  // Prepare chart data
  const monthlyData = [
    { month: "Jan", revenue: 12000, enrollments: 45, users: 120 },
    { month: "Feb", revenue: 15000, enrollments: 52, users: 145 },
    { month: "Mar", revenue: 18000, enrollments: 61, users: 167 },
    { month: "Apr", revenue: 22000, enrollments: 78, users: 192 },
    { month: "May", revenue: 28000, enrollments: 89, users: 218 },
    { month: "Jun", revenue: 35000, enrollments: 102, users: 245 },
  ];

  // Courses by category
  const coursesByCategory = categories
    .map((category) => ({
      name: category.name,
      value: courses.filter(
        (course) =>
          typeof course.categoryId === "object" &&
          course.categoryId._id === category._id
      ).length,
    }))
    .filter((item) => item.value > 0);

  // Course levels distribution
  const courseLevels = [
    {
      name: "Beginner",
      value: courses.filter((c) => c.level === "beginner").length,
    },
    {
      name: "Intermediate",
      value: courses.filter((c) => c.level === "intermediate").length,
    },
    {
      name: "Advanced",
      value: courses.filter((c) => c.level === "advanced").length,
    },
  ];

  // Top performing courses with course data
  const topPerformingCourses = courses.slice(0, 5).map((course) => ({
    title: course.title,
    enrollments: course.enrolledCount || 0,
    revenue: (course.price || 0) * (course.enrolledCount || 0),
    rating: course.averageRating || 0,
    category:
      typeof course.categoryId === "object"
        ? course.categoryId.name
        : "Unknown",
    level: course.level,
  }));

  // Recent activity data
  const recentUsers = users.slice(0, 5);
  const recentCourses = courses.slice(0, 5);

  // Chart colors
  const COLORS = [
    "#6366f1", // indigo
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get growth indicator
  const getGrowthIndicator = (rate: number, isReverse = false) => {
    const isPositive = isReverse ? rate < 0 : rate > 0;
    const IconComponent = isPositive ? ArrowUpIcon : TrendingDown;
    const colorClass = isPositive ? "text-emerald-600" : "text-red-600";
    const bgClass = isPositive
      ? "bg-emerald-100 dark:bg-emerald-900/30"
      : "bg-red-100 dark:bg-red-900/30";

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgClass} ${colorClass}`}
      >
        <IconComponent className="w-3 h-3" />
        {Math.abs(rate)}%
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-100 dark:via-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor your platform's performance and growth metrics
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

        {/* Primary Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                {getGrowthIndicator(revenueGrowthRate)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  from last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                {getGrowthIndicator(userGrowthRate)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalUsers}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  from last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                {getGrowthIndicator(courseGrowthRate)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalCourses}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  from last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                {getGrowthIndicator(23.4)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalEnrollments}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {activeUsers}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {((activeUsers / totalUsers) * 100).toFixed(1)}% of total
                  users
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {((blockedUsers / totalUsers) * 100).toFixed(1)}% of total
                  users
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Lessons
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalLessons}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Avg {(totalLessons / totalCourses || 0).toFixed(1)} per course
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Categories
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalCategories}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {verifiedUsers} verified users
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Revenue & Enrollments
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly trend analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#6366f1"
                    name="Revenue ($)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Enrollments"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    User Growth
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    New user registrations
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="users"
                    fill="#10b981"
                    name="New Users"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Course Difficulty Levels */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Course Difficulty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution by level
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseLevels}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseLevels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index + 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Courses by Category */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden md:block hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Course Categories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution by category
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={coursesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {coursesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Courses */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden md:block hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Top Performing Courses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest revenue generators
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPerformingCourses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-medium text-slate-900 dark:text-slate-100 truncate"
                          title={course.title}
                        >
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            {course.category}
                          </Badge>
                          <Badge
                            variant={
                              course.level === "beginner"
                                ? "secondary"
                                : course.level === "intermediate"
                                ? "default"
                                : "outline"
                            }
                            className="text-xs px-2 py-0.5"
                          >
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {course.enrollments} enrollments
                      </div>
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(course.revenue)}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        {course.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Recent Activity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latest users and courses
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Recent Users
                  </h4>
                  <div className="space-y-3">
                    {recentUsers.slice(0, 3).map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                              {user.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {user.role === "admin" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0.5"
                                >
                                  Admin
                                </Badge>
                              )}
                              {user.isVerified && (
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Recent Courses
                  </h4>
                  <div className="space-y-3">
                    {recentCourses.slice(0, 3).map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate block">
                              {course.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(course.price)}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {course.enrolledCount || 0} enrolled
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(course.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
