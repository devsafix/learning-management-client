import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import Course from "@/pages/Course";
import CourseDetails from "@/pages/CourseDetails";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import Register from "@/pages/Register";
import type { TRole } from "@/types";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { generateRoutes } from "@/utils/generateRoutes";
import { userSidebarItems } from "./userSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import MyVideos from "@/pages/user/MyVideos";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-courses",
        Component: Course,
      },
      {
        path: "course-details/:slug",
        Component: CourseDetails,
      },
      {
        path: "payment/success",
        Component: PaymentSuccess,
      },
      {
        path: "unauthorized",
        Component: Unauthorized,
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.admin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analysis" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.user as TRole),
    path: "/user",
    children: [
      { index: true, element: <Navigate to="/user/my-courses" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "register",
    Component: Register,
  },
  {
    path: "my-videos",
    Component: MyVideos,
  },
]);
