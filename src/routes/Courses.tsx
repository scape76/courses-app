import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Box, Grid, Rating, Pagination } from "@mui/material";
import { getCourses } from "../server";
import type { Course } from "../models/course.model";
import "./courses.css";

export const loader = async (): Promise<Course[]> => {
  const courses = await getCourses();
  return courses;
};

export default function Courses() {
  const coursesPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);

  const courses = useLoaderData() as Course[];

  const handleDisplatedCoursesChange = (page: number) => {
    let displayed = [];
    if (courses) {
      displayed = courses?.slice(
        (page - 1) * coursesPerPage,
        page * coursesPerPage
      );
      setDisplayedCourses(displayed);
    }
  };

  useEffect(() => {
    if (courses) {
      setNumberOfPages(Math.ceil(courses.length / coursesPerPage));
      setDisplayedCourses(courses.slice(0, coursesPerPage));
    }
  }, [courses]);

  const handlePaginationClick = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (page === currentPage) {
      return;
    }
    setCurrentPage(page);
    handleDisplatedCoursesChange(page);
  };

  return (
    <div className="courses">
      <h1 className="courses-title">See our courses below</h1>
      <div className="container row">
        {displayedCourses?.map((course) => {
          let skillsGained = (course.meta.skills || [""])
            .join(", ")
            .toLowerCase();

          return (
            <Link to={course.id} key={course.id} target="_blank">
              <Box
                sx={{
                  width: 350,
                  minHeight: 250,
                  padding: "1rem",
                  fontSize: "16px",
                  fontWeight: "400",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#192231",
                  color: "#fff",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#202b3f;",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  fontSize="0.8rem"
                >
                  <Grid item xs={6}>
                    <img
                      src={course.previewImageLink + "/cover.webp"}
                      width={136.5}
                      height={60}
                      alt="course"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h4 className="course-elem-title">Course</h4>
                    <p>{course.description}</p>
                    <p style={{ opacity: "0.7" }}>
                      lessons: {course.lessonsCount}
                    </p>
                  </Grid>
                </Grid>
                {skillsGained && (
                  <p
                    style={{
                      fontSize: "0.7rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <b>Skills you'll learn: </b> {skillsGained}
                  </p>
                )}

                <Rating
                  name="read-only"
                  size="small"
                  value={course.rating}
                  readOnly
                  style={{ textAlign: "center", margin: "0 auto" }}
                />
              </Box>
            </Link>
          );
        })}
      </div>
      <Pagination
        className="courses__pagination"
        page={currentPage}
        count={numberOfPages}
        onChange={handlePaginationClick}
        variant="outlined"
        color="primary"
        size="large"
      />
    </div>
  );
}
