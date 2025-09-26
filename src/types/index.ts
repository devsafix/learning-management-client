import type { ComponentType } from "react";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "admin" | "user";

export interface Course {
  _id: string;
  title: string;
  slug: string;
}

export interface NewLesson {
  courseId: string;
  title: string;
  videoUrl: string;
  duration: string;
  resources: string[];
  order: string;
}
