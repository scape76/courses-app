import { useEffect, useState, MouseEventHandler } from "react";
import { useLoaderData, useBeforeUnload } from "react-router-dom";
import { Grid, Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import { styled } from "@mui/system";
import { convertSecondsToString } from "../common";
import { getCourseById } from "../server";
import localStorageService from "../services/localStorage.service";
import type { lastlyViewedData, Course, Lesson } from "../models";
import "./course.css";

export const loader = async ({ params }: any): Promise<Course | null> => {
  const course = await getCourseById(params.courseId);
  return course || null;
};

const BlurredGrid = styled(Grid)(({ theme }) => ({
  filter: "blur(1px)",
}));

const LessonContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

const RightColumnGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "calc(5rem * 4)",
    overflowY: "scroll",
  },
}));

const LeftColumnGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "auto",
    maxWidth: "100%",
    padding: "1rem 0",
    margin: "0 auto",
  },
}));

export default function Course() {
  const course = useLoaderData() as Course;
  let videoElement: HTMLVideoElement;

  const isPipSupported = "pictureInPictureEnabled" in document;

  const [currentLesson, setCurrentLesson] = useState<Lesson>(course.lessons[0]);
  const [error, setError] = useState("");

  useBeforeUnload(() => {
    // для кожного курсу я зберігаю останню прогляноту лекцію та час,
    // на якому зупинився користувач
    const data: lastlyViewedData = {
      lesson: currentLesson,
      time: videoElement.currentTime,
    };
    localStorageService.setLastlyViewedData(course.id, data);
  });

  useEffect(() => {
    const currentVideoLink = currentLesson.link;
    if (Hls.isSupported()) {
      videoElement = document.getElementById(
        "lesson-video"
      ) as HTMLVideoElement;
      const hls = new Hls();
      // CORS не дозволяє
      // hls.loadSource(currentVideoLink)
      hls.loadSource(
        "http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8"
      );
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // video.src = currentVideoLink;
      videoElement.src =
        "http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8";
    }
  }, [currentLesson]);

  useEffect(() => {
    if (course) {
      let lastlyViewedData;
      const storedData = localStorageService.getLastlyViewedData(course.id);
      if (storedData) {
        lastlyViewedData = JSON.parse(storedData) as lastlyViewedData;
        setCurrentLesson(lastlyViewedData.lesson);
        videoElement.currentTime = lastlyViewedData.time;
      } else {
        setCurrentLesson(course.lessons[0]);
        videoElement.currentTime = 0;
      }
    } else {
      setError("Could not fetch courses");
    }
  }, []);

  const handeLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const togglePictureInPicture = () => {
    if (videoElement !== document.pictureInPictureElement) {
      videoElement.requestPictureInPicture();
    } else {
      document.exitPictureInPicture();
    }
  };

  return (
    <section className="course-section">
      {error ? (
        <Typography
          fontFamily="inherit"
          textAlign="center"
          margin="1rem"
          fontSize="1rem"
          color="red"
        >
          {error}
        </Typography>
      ) : (
        <LessonContainer
          sx={{ width: "100%", height: "80vh" }}
          container
          className="lesson-container"
        >
          <LeftColumnGrid className="col-left" item xs={8}>
            <video id="lesson-video" controls></video>
            {isPipSupported && (
              <Button
                sx={{
                  zIndex: 2,
                  position: "absolute",
                  top: 10,
                  left: 10,
                  color: "#fff",
                }}
                onClick={togglePictureInPicture}
                id="pipButton"
              >
                <PictureInPictureIcon />
              </Button>
            )}
          </LeftColumnGrid>
          <RightColumnGrid
            sx={{ overflowX: "hidden", overflowY: "scroll" }}
            className="col-right"
            item
            xs={4}
          >
            <Grid
              container
              spacing={2}
              padding="1rem"
              className="course-title"
              alignItems="center"
            >
              <Grid item xs={4}>
                <img
                  width="100%"
                  src={`${course.previewImageLink}/cover.webp`}
                  alt="preview"
                />
              </Grid>
              <Grid item xs={8}>
                <Typography fontFamily="inherit" fontSize="0.7rem">
                  COURSE
                </Typography>
                <Typography fontFamily="inherit" fontSize="1rem">
                  {course.title}
                </Typography>
              </Grid>
            </Grid>
            {course.lessons
              .sort((lesson1, lesson2) => lesson1.order - lesson2.order)
              .map((lesson) => {
                const isSelected = lesson.id === currentLesson.id;
                const isAvailable = lesson.status === "unlocked";
                const { id, order, title, duration } = lesson;
                const LessonGrid = isAvailable ? Grid : BlurredGrid;
                const handleLessonBtnClick = isAvailable
                  ? () => handeLessonClick(lesson)
                  : null;
                return (
                  <Box key={id} sx={{ position: "relative" }}>
                    {!isAvailable && (
                      <LockIcon
                        sx={{
                          fontSize: "1.5rem",
                          position: "absolute",
                          top: "calc(50% - 0.75rem)",
                          left: "calc(50% - 0.75rem)",
                        }}
                      />
                    )}
                    <LessonGrid
                      className={`lesson-data ${isSelected ? "selected" : ""}`}
                      container
                      sx={{
                        height: "5rem",
                        padding: "0 1rem",
                        margin: "0",
                        position: "relative",
                        "&:hover": {
                          cursor: isAvailable ? "pointer" : "default",
                        },
                      }}
                      spacing={2}
                      onClick={
                        handleLessonBtnClick as MouseEventHandler<HTMLDivElement>
                      }
                    >
                      <Grid item alignSelf="start">
                        <Typography fontFamily="inherit" fontSize="0.9rem">
                          {order}
                        </Typography>
                      </Grid>
                      <Grid
                        className="lesson-title"
                        item
                        alignItems="space-between"
                      >
                        <Typography fontFamily="inherit" fontSize="0.9rem">
                          {title}
                        </Typography>
                        <Typography
                          fontFamily="inherit"
                          fontSize="0.75rem"
                          fontWeight="300"
                        >
                          {convertSecondsToString(duration)}
                        </Typography>
                      </Grid>
                    </LessonGrid>
                  </Box>
                );
              })}
          </RightColumnGrid>
        </LessonContainer>
      )}
    </section>
  );
}
