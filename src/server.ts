import axios from "axios";
import type { Course } from "./models/course.model";

axios.defaults.headers.common = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOTRlNjg4NS1kM2U5LTQwY2EtYTVjYy01MDRkNjZlZDVlN2QiLCJwbGF0Zm9ybSI6InN1YnNjcmlwdGlvbnMiLCJpYXQiOjE2Nzg3MDQ3NjIsImV4cCI6MTY3OTYwNDc2Mn0.Qw3LF39CDp27ZxoGzt5rikJM_OTx0eNaoyFFLxxrXUM`,
};

const baseUrl = "https://api.wisey.app/api/v1/core/preview-courses";

export const getCourses = async (): Promise<Course[] | void> => {
  try {
    const { data } = await axios.get(`${baseUrl}`);
    return data.courses;
  } catch (e) {
    console.log(e);
  }
};

export const getCourseById = async (id: string): Promise<Course | void> => {
  try {
    const { data } = await axios.get(`${baseUrl}/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};
