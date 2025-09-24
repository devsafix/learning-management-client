import { axiosInstance } from "@/lib/axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, type AxiosRequestConfig } from "axios";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      console.log("Axios request:", { url, method, data, params, headers });

      const result = await axiosInstance({
        url,
        method,
        data, // This is the request body
        params, // This is for query parameters
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      console.log("Axios response:", result.data);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      console.error("Axios error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
