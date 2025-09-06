import Home from "@/pages/Home";

import type { ISidebarItem } from "@/types";

export const studentSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Update Profile",
        url: "/admin/profile",
        component: Home,
      },
    ],
  },
];
