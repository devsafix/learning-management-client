import {
  useGetEarningsQuery,
  useGetTopCoursesQuery,
} from "@/redux/features/admin/admin.api";
import { useGetAllUsersQuery } from "@/redux/features/user/user.api";
import { useGetAllCourseQuery } from "@/redux/features/course/course.api";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";

import {
  LineChart,
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
  Calendar,
  ArrowUpIcon,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const { data: topCoursesData, isLoading: topCoursesLoading } =
    useGetTopCoursesQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCourseQuery(undefined);
  const { data: categoriesData } = useGetCategoriesQuery({});

  if (earningsLoading || topCoursesLoading || usersLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const users: User[] = usersData?.data || [];
  const courses: Course[] = coursesData?.data || [];
  const categories: Category[] = categoriesData?.data || [];
  const earnings = earningsData?.data;
  const topCourses = topCoursesData?.data || [];

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
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your platform's performance and growth
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+
              {revenueGrowthRate}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+
              {userGrowthRate}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />+
              {courseGrowthRate}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              +23.4% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((activeUsers / totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((blockedUsers / totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Play className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Avg {(totalLessons / totalCourses || 0).toFixed(1)} per course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedUsers} verified users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue & Enrollments Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#8884d8"
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  name="Enrollments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Difficulty Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Course Difficulty Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Courses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Courses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex-1">
                    <h4 className="font-medium truncate">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge
                        variant={
                          course.level === "beginner"
                            ? "default"
                            : course.level === "intermediate"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {course.enrollments} enrollments
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(course.revenue)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      ⭐ {course.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Recent Users</h4>
                <div className="space-y-2">
                  {recentUsers.slice(0, 3).map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-3 w-3" />
                        </div>
                        <span>{user.name}</span>
                        {user.role === "admin" && (
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Recent Courses</h4>
                <div className="space-y-2">
                  {recentCourses.slice(0, 3).map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-3 w-3" />
                        </div>
                        <span className="truncate">{course.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">
                          {formatDate(course.createdAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(course.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
