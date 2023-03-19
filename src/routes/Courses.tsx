import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Box, Grid, Rating, Pagination, Typography } from "@mui/material";
import { getCourses } from "../server";
import type { Course } from "../models/course.model";

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
      <Typography
        fontFamily="inherit"
        textAlign="center"
        margin="1rem"
        fontSize="2rem"
      >
        See our courses below
      </Typography>
      <Box display="flex" margin="0 1rem" justifyContent="center" flexWrap="wrap" gap="1rem">
        {displayedCourses?.map((course) => {
          let skillsGained = (course.meta.skills || [""])
            .join(", ")
            .toLowerCase();

          return (
            <Link to={course.id} key={course.id} target="_blank">
              <Box
                flexShrink={1}
                sx={{
                  width: {
                    xs: 280,
                    sm: 320,
                    lg: 400
                  },
                  height: 250,
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
                      width="100%"
                      alt="course"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      fontFamily="inherit"
                      fontSize="0.8rem"
                      color="#c1c3ca"
                    >
                      Course
                    </Typography>
                    <p>{course.description}</p>
                    <Typography
                      fontFamily="inherit"
                      fontSize="0.8rem"
                      color="#c1c3ca"
                    >
                      lessons: {course.lessonsCount}
                    </Typography>
                  </Grid>
                </Grid>
                {skillsGained && (
                  <Typography
                    fontFamily="inherit"
                    fontSize="0.7rem"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <b>Skills you'll learn: </b> {skillsGained}
                  </Typography>
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
      </Box>
      <Pagination
        sx={{
          margin: "0 auto",
          width: "fit-content",
          padding: "3rem 0",
          "& ul li button": {
            color: "#fff",
            "& svg": {
              color: "#fff",
            },
          },
        }}
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
