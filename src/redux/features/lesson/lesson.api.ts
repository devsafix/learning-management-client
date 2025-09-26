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

    getAllLessons: build.query<{ data: Lesson[] }, void>({
      query: () => ({
        url: "/lessons",
        method: "GET",
      }),
      providesTags: ["LESSON"],
    }),

    createLesson: build.mutation<any, LessonCreatePayload>({
      query: (lessonData) => {
        console.log("Creating lesson with data:", lessonData);
        return {
          url: "/lessons",
          method: "POST",
          data: lessonData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["LESSON", "COURSE"],
    }),

    updateLesson: build.mutation<
      any,
      { id: string; body: Partial<LessonCreatePayload> }
    >({
      query: ({ id, body }) => {
        console.log("Updating lesson with data:", { id, body });
        return {
          url: `/lessons/${id}`,
          method: "PATCH",
          data: body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["LESSON", "COURSE"],
    }),

    deleteLesson: build.mutation<any, string>({
      query: (id) => {
        console.log("Deleting lesson with ID:", id);
        return {
          url: `/lessons/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["LESSON", "COURSE"],
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
