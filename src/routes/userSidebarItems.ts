import MyCourses from "@/pages/user/MyCourses";
import MyProfile from "@/pages/user/MyProfile";

import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "My Profile",
        url: "/user/my-profile",
        component: MyProfile,
      },
    ],
  },
  {
    title: "Course Management",
    items: [
      {
        title: "My Courses",
        url: "/user/my-courses",
        component: MyCourses,
      },
    ],
  },
];
