import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { LmsUser, MOCK_USERS, Role, MOCK_COURSES } from "./data";

interface LmsState {
  user: LmsUser;
  setRole: (role: Role) => void;
  enrolled: string[]; // course ids
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  completedLessons: Record<string, string[]>; // courseId -> lessonIds
  toggleLesson: (courseId: string, lessonId: string) => void;
  courseProgress: (courseId: string) => number; // 0..100
}

const LmsContext = createContext<LmsState | null>(null);

const STORAGE_KEY = "lms-state-v2";

interface Persisted {
  roleId: string;
  enrolled: string[];
  completedLessons: Record<string, string[]>;
}

const defaultPersisted: Persisted = {
  roleId: "u-stud",
  enrolled: ["c-html", "c-python"],
  completedLessons: { "c-html": ["l-1"] },
};

export const LmsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Persisted>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultPersisted, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return defaultPersisted;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const user = useMemo(
    () => MOCK_USERS.find(u => u.id === state.roleId) ?? MOCK_USERS[2],
    [state.roleId]
  );

  const setRole = useCallback((role: Role) => {
    const u = MOCK_USERS.find(x => x.role === role);
    if (u) setState(s => ({ ...s, roleId: u.id }));
  }, []);

  const enroll = useCallback((courseId: string) => {
    setState(s => s.enrolled.includes(courseId) ? s : { ...s, enrolled: [...s.enrolled, courseId] });
  }, []);
  const unenroll = useCallback((courseId: string) => {
    setState(s => ({ ...s, enrolled: s.enrolled.filter(id => id !== courseId) }));
  }, []);
  const isEnrolled = useCallback((courseId: string) => state.enrolled.includes(courseId), [state.enrolled]);

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setState(s => {
      const list = s.completedLessons[courseId] ?? [];
      const next = list.includes(lessonId) ? list.filter(id => id !== lessonId) : [...list, lessonId];
      return { ...s, completedLessons: { ...s.completedLessons, [courseId]: next } };
    });
  }, []);

  const courseProgress = useCallback((courseId: string) => {
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    const total = course.chapters.reduce((n, ch) => n + ch.lessons.length, 0);
    if (!total) return 0;
    const done = (state.completedLessons[courseId] ?? []).length;
    return Math.round((done / total) * 100);
  }, [state.completedLessons]);

  const value: LmsState = {
    user,
    setRole,
    enrolled: state.enrolled,
    enroll,
    unenroll,
    isEnrolled,
    completedLessons: state.completedLessons,
    toggleLesson,
    courseProgress,
  };

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
};

export const useLms = () => {
  const ctx = useContext(LmsContext);
  if (!ctx) throw new Error("useLms must be used inside LmsProvider");
  return ctx;
};
