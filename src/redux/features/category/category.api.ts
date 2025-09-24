// src/redux/features/category/category.api.ts
import { baseApi } from "../../baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["CATEGORY"],
    }),

    addCategory: build.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    updateCategory: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
