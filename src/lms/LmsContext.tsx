import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { LmsUser, MOCK_COURSES, Role } from "./data";
import { useAuth } from "@/contexts/AuthContext";

interface LmsState {
  user: LmsUser;
  enrolled: string[];
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  completedLessons: Record<string, string[]>;
  toggleLesson: (courseId: string, lessonId: string) => void;
  courseProgress: (courseId: string) => number;
}

const LmsContext = createContext<LmsState | null>(null);

interface Persisted {
  enrolled: string[];
  completedLessons: Record<string, string[]>;
}

const defaultPersisted: Persisted = {
  enrolled: ["c-html", "c-python"],
  completedLessons: {},
};

const storageKey = (uid: string | null) => `lms-state-${uid ?? "anon"}`;

export const LmsProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, profile, role } = useAuth();
  const uid = authUser?.id ?? null;

  const [state, setState] = useState<Persisted>(defaultPersisted);

  // Load when user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(uid));
      setState(raw ? { ...defaultPersisted, ...JSON.parse(raw) } : defaultPersisted);
    } catch {
      setState(defaultPersisted);
    }
  }, [uid]);

  useEffect(() => {
    localStorage.setItem(storageKey(uid), JSON.stringify(state));
  }, [state, uid]);

  const lmsUser: LmsUser = useMemo(() => ({
    id: uid ?? "guest",
    name: profile?.display_name ?? authUser?.email?.split("@")[0] ?? "Guest",
    email: profile?.email ?? authUser?.email ?? "",
    role: (role ?? "student") as Role,
  }), [uid, profile, authUser, role]);

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
    user: lmsUser,
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
