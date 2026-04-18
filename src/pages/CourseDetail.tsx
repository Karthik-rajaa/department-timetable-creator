import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, FileText, BookOpen, HelpCircle } from "lucide-react";
import { AppLayout } from "@/lms/AppLayout";
import { MOCK_COURSES, Lesson } from "@/lms/data";
import { useLms } from "@/lms/LmsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LessonContent } from "@/components/LessonContent";

const lessonIcon = (type: Lesson["type"]) =>
  type === "quiz" ? HelpCircle : type === "text" ? BookOpen : FileText;

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const { isEnrolled, enroll, completedLessons, toggleLesson, courseProgress, user } = useLms();
  const enrolled = course ? isEnrolled(course.id) : false;
  const done = course ? completedLessons[course.id] ?? [] : [];
  const allLessons = useMemo(() => course?.chapters.flatMap(c => c.lessons) ?? [], [course]);
  const [active, setActive] = useState<Lesson | null>(allLessons[0] ?? null);

  if (!course) {
    return (
      <AppLayout title="Course not found">
        <div className="container py-10">
          <Button asChild variant="outline"><Link to="/lms/courses"><ArrowLeft className="w-4 h-4 mr-2" />Back to courses</Link></Button>
        </div>
      </AppLayout>
    );
  }

  const handleComplete = () => {
    if (active) toggleLesson(course.id, active.id);
  };

  const isActiveDone = active ? done.includes(active.id) : false;

  return (
    <AppLayout title={course.title} subtitle={`${course.instructor} · ${course.category}`}>
      <div className="container py-6 space-y-6">
        <div className="rounded-2xl overflow-hidden border border-border/60">
          <div className="h-32 sm:h-40 relative" style={{ background: course.coverGradient }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white drop-shadow">{course.title}</h2>
              </div>
              {!enrolled && user.role === "student" && (
                <Button className="btn-gradient" onClick={() => enroll(course.id)}>Enroll now</Button>
              )}
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="text-sm text-muted-foreground">{course.description}</p>
            {enrolled && (
              <div className="mt-3 max-w-sm">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Your progress</span>
                  <span className="font-medium">{courseProgress(course.id)}%</span>
                </div>
                <Progress value={courseProgress(course.id)} className="h-1.5" />
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base font-display">
                {active ? active.title : "Select a lesson"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {active ? (
                <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <LessonContent
                    lesson={active}
                    enrolled={enrolled}
                    isDone={isActiveDone}
                    onComplete={handleComplete}
                  />
                </motion.div>
              ) : (
                <p className="text-sm text-muted-foreground">No lessons in this course yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base font-display">Course Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {course.chapters.map((ch, ci) => (
                <div key={ch.id}>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Chapter {ci + 1} · {ch.title}</p>
                  <div className="space-y-1">
                    {ch.lessons.map(l => {
                      const Icon = lessonIcon(l.type);
                      const isDone = done.includes(l.id);
                      const isActive = active?.id === l.id;
                      return (
                        <button
                          key={l.id}
                          onClick={() => setActive(l)}
                          className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-sm transition ${isActive ? "bg-secondary" : "hover:bg-muted"}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
