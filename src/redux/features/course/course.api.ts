/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export interface CourseCreatePayload {
  title: string;
  description: string;
  price: number;
  discount?: number;
  level: "beginner" | "intermediate" | "advanced";
  categoryId: string;
  thumbnail: string;
  totalLessons?: number;
}

export interface CourseUpdatePayload extends Partial<CourseCreatePayload> {
  id: string;
}

const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCourse: build.query({
      query: (params) => ({
        url: "/course",
        method: "GET",
        params,
      }),
      providesTags: ["COURSE"],
    }),

    createCourse: build.mutation<any, CourseCreatePayload>({
      query: (courseData) => {
        console.log("Creating course with data:", courseData);
        return {
          url: "/course",
          method: "POST",
          data: courseData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["COURSE"],
    }),

    getCourseBySlug: build.query({
      query: (slug: string) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: ["COURSE"],
    }),

    updateCourse: build.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => {
        console.log("Updating course with data:", { id, body });
        return {
          url: `/course/${id}`,
          method: "PATCH",
          data: body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["COURSE"],
    }),

    deleteCourse: build.mutation<any, string>({
      query: (id) => {
        console.log("Deleting course with ID:", id);
        return {
          url: `/course/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["COURSE"],
    }),

    enrollCourse: build.mutation<any, { courseId: string }>({
      query: ({ courseId }) => ({
        url: `/orders/enroll/${courseId}`,
        method: "POST",
        data: {},
      }),
      invalidatesTags: ["COURSE"],
    }),
  }),
});

export const {
  useGetAllCourseQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollCourseMutation,
} = courseApi;
