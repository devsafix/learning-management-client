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
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalCategories: number;
  activeUsers: number;
  blockedUsers: number;
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

const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEarnings: build.query<{ data: EarningsData }, void>({
      query: () => ({
        url: "/admin/earnings",
        method: "GET",
      }),
      providesTags: ["ADMIN"],
    }),

    
  }),
});

export const {
  useGetEarningsQuery,
  useGetTopCoursesQuery,
  useGetDashboardStatsQuery,
} = adminApi;
