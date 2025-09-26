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

    
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = userApi;
