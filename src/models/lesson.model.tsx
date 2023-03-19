export type Lesson = {
  id: string;
  title: string;
  duration: number;
  order: number;
  type: string;
  status: "unlocked" | "locked";
  link: string;
  previewImageLink: string;
  meta: null;
};
