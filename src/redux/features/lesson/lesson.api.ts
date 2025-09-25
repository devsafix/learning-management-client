/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export interface LessonCreatePayload {
  courseId: string;
  title: string;
  videoUrl: string;
  duration?: number;
  resources?: string[];
  order?: number;
}

export interface LessonUpdatePayload extends Partial<LessonCreatePayload> {
  id: string;
}

export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  duration: number;
  resources: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

const lessonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLessonsByCourse: build.query<{ data: Lesson[] }, string>({
      query: (courseId: string) => ({
        url: `/lessons/by-course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["LESSON"],
    }),

    
  }),
});

export const {
  useGetLessonsByCourseQuery,
  useGetAllLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
