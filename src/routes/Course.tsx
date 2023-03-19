import { useEffect, useState, MouseEventHandler } from "react";
import { useLoaderData, useBeforeUnload } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/system";
import { convertSecondsToString } from "../common";
import { getCourseById } from "../server";
import localStorageService from "../services/localStorage.service";
import type { lastlyViewedData } from "../models/lastlyViewedData.model";
import type { Course } from "../models/course.model";
import type { Lesson } from "../models/lesson.model";
import "./course.css";

export const loader = async ({ params }: any): Promise<Course> => {
  const course = await getCourseById(params.courseId);
  return course;
};

const BlurredGrid = styled(Grid)(({ theme }) => ({
  filter: "blur(1px)",
}));

export default function Course() {
  const course = useLoaderData() as Course;
  let video: HTMLMediaElement;

  const [currentLesson, setCurrentLesson] = useState<Lesson>(course.lessons[0]);

  useBeforeUnload(() => {
    // для кожного курсу я зберігаю останню прогляноту лекцію та час,
    // на якому зупинився користувач
    const data: lastlyViewedData = {
      lesson: currentLesson,
      time: video.currentTime,
    };
    localStorageService.setLastlyViewedData(course.id, data);
  });

  useEffect(() => {
    const currentVideoLink = currentLesson.link;
    if (Hls.isSupported()) {
      video = document.getElementById("lesson-video") as HTMLMediaElement;
      const hls = new Hls();
      // CORS не дозволяє 
      // hls.loadSource(currentVideoLink)
      hls.loadSource(
        "http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8"
      );
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // video.src = currentVideoLink;
      video.src =
        "http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8";
    }
  }, [currentLesson]);

  useEffect(() => {
    let lastlyViewedData;
    const storedData = localStorageService.getLastlyViewedData(course.id);
    if (storedData) {
      lastlyViewedData = JSON.parse(storedData) as lastlyViewedData;
      setCurrentLesson(lastlyViewedData.lesson);
      video.currentTime = lastlyViewedData.time;
    } else {
      setCurrentLesson(course.lessons[0]);
      video.currentTime = 0;
    }
  }, []);

  const handeLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <section className="course-section">
      <Grid
        sx={{ width: "100%", height: "80vh" }}
        container
        className="lesson-container"
      >
        <Grid className="col-left" item xs={8}>
          <video id="lesson-video" controls></video>
        </Grid>
        <Grid
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
            <Grid item xs={6}>
              <h3>COURSE</h3>
              <h2>{course.title}</h2>
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
                      <span>{order}</span>
                    </Grid>
                    <Grid
                      className="lesson-title"
                      item
                      alignItems="space-between"
                    >
                      <h4>{title}</h4>
                      <span>{convertSecondsToString(duration)}</span>
                    </Grid>
                  </LessonGrid>
                </Box>
              );
            })}
        </Grid>
      </Grid>
    </section>
  );
}
