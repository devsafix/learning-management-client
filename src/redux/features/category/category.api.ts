/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreatePayload {
  name: string;
}

export interface CategoryUpdatePayload {
  id: string;
  name: string;
}

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<{ data: Category[] }, void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["CATEGORY"],
    }),

    addCategory: build.mutation<any, CategoryCreatePayload>({
      query: (data) => {
        console.log("Creating category with data:", data);
        return {
          url: "/category",
          method: "POST",
          data: { name: data.name },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),

    updateCategory: build.mutation<any, CategoryUpdatePayload>({
      query: ({ id, name }) => {
        console.log("Updating category:", { id, name });
        return {
          url: `/category/${id}`,
          method: "PATCH",
          data: { name }, // Send as object with name property
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),

    deleteCategory: build.mutation<any, string>({
      query: (id) => {
        console.log("Deleting category with ID:", id);
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
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
