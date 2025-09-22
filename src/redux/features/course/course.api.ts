/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCourse: build.query({
      query: () => ({
        url: "/course",
        method: "GET",
      }),
      providesTags: ["COURSE"],
    }),

    getCourseBySlug: build.query({
      query: (slug: string) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: ["COURSE"],
    }),
    enrollCourse: build.mutation<any, { courseId: string }>({
      query: ({ courseId }) => ({
        url: `/orders/enroll/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["COURSE"],
    }),
  }),
});

export const {
  useGetAllCourseQuery,
  useGetCourseBySlugQuery,
  useEnrollCourseMutation,
} = courseApi;
