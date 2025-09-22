import App from "@/App";
import Course from "@/pages/Course";
// import DashboardLayout from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";

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
  // {
  //   Component: withAuth(DashboardLayout, role.admin as TRole),
  //   path: "/admin",
  //   children: [
  //     { index: true, element: <Navigate to="/admin/profile" /> },
  //     ...generateRoutes(adminSidebarItems),
  //   ],
  // },
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
