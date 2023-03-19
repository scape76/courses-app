import { Lesson } from "./lesson.model";

export type Course = {
  id: string;
  title: string;
  tags: string[];
  launchDate: string;
  status: "launched" | "draft" | "archived";
  description: string;
  duration: number;
  lessonsCount: number;
  containsLockedLessons: boolean;
  previewImageLink: string;
  rating: number;
  meta: {
    slug: string;
    skills: string[];
    courseVideoPreview: {
      link: string;
      duration: number;
      previewImageLink: string;
    };
  };
  lessons: Lesson[];
};
