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
  }),
});

export const { useGetAllCourseQuery, useGetCourseBySlugQuery } = courseApi;
