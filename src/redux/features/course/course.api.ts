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
  }),
});

export const { useGetAllCourseQuery } = courseApi;
