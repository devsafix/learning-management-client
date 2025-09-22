import { baseApi } from "../../baseApi";

const lessonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLessonById: build.query({
      query: (id: string) => ({
        url: `/lessons/by-course/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLessonByIdQuery } = lessonApi;
