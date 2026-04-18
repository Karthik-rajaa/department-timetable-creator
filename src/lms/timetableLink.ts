// Helpers that bridge the timetable scheduler with LMS courses.
import { TIME_SLOTS } from "@/types/timetable";
import { MOCK_COURSES, Course } from "./data";

export interface MockSession {
  day: string;
  slotId: string;
  time: string;
  subject: string;
  course: Course;
  venue: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const classSlots = TIME_SLOTS.filter(s => s.type === "class");

// Deterministic "today" mock schedule so the page always has data.
export const getMockWeekSessions = (): MockSession[] => {
  const sessions: MockSession[] = [];
  MOCK_COURSES.forEach((course, ci) => {
    const day = DAYS[ci % DAYS.length];
    const slot = classSlots[ci % classSlots.length];
    sessions.push({
      day,
      slotId: slot.id,
      time: slot.time,
      subject: course.linkedSubjects[0] ?? course.title,
      course,
      venue: `Room ${201 + ci}`,
    });
    // a second weekly session
    const slot2 = classSlots[(ci + 2) % classSlots.length];
    const day2 = DAYS[(ci + 2) % DAYS.length];
    sessions.push({
      day: day2,
      slotId: slot2.id,
      time: slot2.time,
      subject: course.linkedSubjects[0] ?? course.title,
      course,
      venue: `Room ${201 + ci}`,
    });
  });
  return sessions;
};

export const getTodayName = (): string => {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  // Map weekend to Monday so demo always shows classes.
  if (idx === 0 || idx === 6) return "Monday";
  return DAYS[idx - 1];
};

export const getTodaySessions = (): MockSession[] => {
  const today = getTodayName();
  return getMockWeekSessions().filter(s => s.day === today);
};

export const getUpcomingSessions = (limit = 5): MockSession[] => {
  const today = getTodayName();
  const all = getMockWeekSessions();
  const todayIdx = DAYS.indexOf(today);
  return [...all]
    .sort((a, b) => {
      const da = (DAYS.indexOf(a.day) - todayIdx + 5) % 5;
      const db = (DAYS.indexOf(b.day) - todayIdx + 5) % 5;
      if (da !== db) return da - db;
      return a.time.localeCompare(b.time);
    })
    .slice(0, limit);
};
