import Home from "@/pages/Home";

import type { ISidebarItem } from "@/types";

export const studentSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "My Courses",
        url: "/user/my-course",
        component: Home,
      },
    ],
  },
];
