import { baseApi } from "../../baseApi";

export interface EarningsData {
  totalRevenue: number;
  orders: Array<{
    _id: string;
    course: {
      _id: string;
      title: string;
      price: number;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TopCourse {
  _id: string;
  studentCount: number;
  totalRevenue?: number;
  title?: string;
  price?: number;
  averageRating?: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalCategories: number;
  activeUsers: number;
  blockedUsers: number;
  verifiedUsers: number;
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    enrollments: number;
  }>;
  coursesByCategory: Array<{
    category: string;
    count: number;
  }>;
  recentEnrollments: Array<{
    _id: string;
    user: string;
    course: string;
    createdAt: string;
    amount: number;
  }>;
}

export interface UserAnalytics {
  total: number;
  active: number;
  blocked: number;
  verified: number;
  admins: number;
  registrationTrend: Array<{
    month: string;
    users: number;
    active: number;
    verified: number;
  }>;
}

export interface CourseAnalytics {
  total: number;
  byLevel: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  totalLessons: number;
  averageLessonsPerCourse: number;
  creationTrend: Array<{
    month: string;
    courses: number;
    lessons: number;
  }>;
}

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<{ data: DashboardStats }, void>({
      query: () => ({
        url: "/admin/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["ADMIN", "USER", "COURSE", "LESSON"],
    }),

    getEarnings: build.query<{ data: EarningsData }, void>({
      query: () => ({
        url: "/admin/earnings",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    getTopCourses: build.query<{ data: TopCourse[] }, void>({
      query: () => ({
        url: "/admin/top-courses",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    getUserAnalytics: build.query<{ data: UserAnalytics }, void>({
      query: () => ({
        url: "/admin/user-analytics",
        method: "GET",
      }),
      providesTags: ["ADMIN", "USER"],
    }),

    getCourseAnalytics: build.query<{ data: CourseAnalytics }, void>({
      query: () => ({
        url: "/admin/course-analytics",
        method: "GET",
      }),
      providesTags: ["ADMIN", "COURSE", "LESSON"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetEarningsQuery,
  useGetTopCoursesQuery,
  useGetUserAnalyticsQuery,
  useGetCourseAnalyticsQuery,
} = adminApi;
