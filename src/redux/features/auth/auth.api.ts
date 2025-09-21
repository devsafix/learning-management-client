import { baseApi } from "../../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
