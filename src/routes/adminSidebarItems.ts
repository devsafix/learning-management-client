import AllCategory from "@/pages/admin/AllCategory";
import AllCourse from "@/pages/admin/AllCourse";
import AllLessons from "@/pages/admin/AllLessons";
import AllUsers from "@/pages/admin/AllUsers";
import Analytics from "@/pages/admin/Analytics";
import MyProfile from "@/pages/user/MyProfile";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "My Profile",
        url: "/admin/my-profile",
        component: MyProfile,
      },
      {
        title: "Analytics",
        url: "/admin/analysis",
        component: Analytics,
      },
    ],
  },
  {
    title: "Course Management",
    items: [
      {
        title: "All Category",
        url: "/admin/all-category",
        component: AllCategory,
      },
      {
        title: "All Courses",
        url: "/admin/all-courses",
        component: AllCourse,
      },
      {
        title: "All Lessons",
        url: "/admin/all-lessons",
        component: AllLessons,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        url: "/admin/all-users",
        component: AllUsers,
      },
    ],
  },
];
