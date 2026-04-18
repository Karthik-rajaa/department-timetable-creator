import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { AppLayout } from "@/lms/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_COURSES } from "@/lms/data";
import { useLms } from "@/lms/LmsContext";

const Courses = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const { isEnrolled, enroll, courseProgress, user } = useLms();

  const categories = useMemo(() => ["all", ...Array.from(new Set(MOCK_COURSES.map(c => c.category)))], []);
  const filtered = useMemo(
    () => MOCK_COURSES.filter(c =>
      (category === "all" || c.category === category) &&
      (c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()))
    ),
    [query, category]
  );

  return (
    <AppLayout title="Courses" subtitle="Browse, enroll and continue learning">
      <div className="container py-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses…" className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button key={cat} size="sm" variant={category === cat ? "default" : "outline"} onClick={() => setCategory(cat)} className="capitalize">
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const enrolled = isEnrolled(c.id);
            return (
              <Card key={c.id} className="glass-card overflow-hidden group">
                <div className="h-24 relative" style={{ background: c.coverGradient }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white/80" />
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Badge variant="secondary" className="text-[10px] mb-2">{c.category}</Badge>
                    <h3 className="font-display font-semibold text-base leading-tight">{c.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{c.description}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">By {c.instructor}</p>
                  {enrolled && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{courseProgress(c.id)}%</span>
                      </div>
                      <Progress value={courseProgress(c.id)} className="h-1.5" />
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/lms/courses/${c.id}`}>{enrolled ? "Continue" : "View"}</Link>
                    </Button>
                    {!enrolled && user.role === "student" && (
                      <Button size="sm" className="btn-gradient" onClick={() => enroll(c.id)}>Enroll</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No courses match your search.</p>
        )}
      </div>
    </AppLayout>
  );
};

export default Courses;
