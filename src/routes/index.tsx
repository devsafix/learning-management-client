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

      // {
      //   path: "contact",
      //   Component: Contact,
      // },

      // {
      //   path: "unauthorized",
      //   Component: Unauthorized,
      // },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.admin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/profile" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  // {
  //   Component: withAuth(DashboardLayout, role.rider as TRole),
  //   path: "/rider",
  //   children: [
  //     { index: true, element: <Navigate to="/rider/profile" /> },
  //     ...generateRoutes(riderSidebarItems),
  //   ],
  // },
  // {
  //   Component: withAuth(DashboardLayout, role.driver as TRole),
  //   path: "/driver",
  //   children: [
  //     { index: true, element: <Navigate to="/driver/profile" /> },
  //     ...generateRoutes(driverSidebarItems),
  //   ],
  // },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "register",
    Component: Register,
  },
]);
