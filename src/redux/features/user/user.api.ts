/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone: string;
  address: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdatePayload {
  name?: string;
  phone?: string;
  address?: string;
  role?: "admin" | "user";
  isVerified?: boolean;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<{ data: User[] }, void>({
      query: () => ({
        url: "/users/all-users",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getSingleUser: build.query<{ data: User }, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUser: build.mutation<any, { id: string; body: UserUpdatePayload }>({
      query: ({ id, body }) => {
        console.log("Updating user with data:", { id, body });
        return {
          url: `/users/${id}`,
          method: "PATCH",
          data: body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["USER"],
    }),

    blockUser: build.mutation<any, string>({
      query: (id) => {
        console.log("Blocking user with ID:", id);
        return {
          url: `/users/block/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["USER"],
    }),

    
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = userApi;
