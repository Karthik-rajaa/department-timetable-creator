import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { Lesson, QuizQuestion } from "@/lms/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Render simple markdown-ish text: paragraphs, **bold**, `inline`, ```code blocks```, and - lists. */
function renderText(content: string) {
  // Split on triple backticks to separate code blocks
  const parts = content.split(/```/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // code block
      return (
        <pre key={i} className="bg-muted/60 border border-border/60 rounded-lg p-3 overflow-x-auto text-xs font-mono leading-relaxed my-3">
          <code>{part.trim()}</code>
        </pre>
      );
    }
    // text block — split into paragraphs by blank lines
    const blocks = part.split(/\n\s*\n/).filter(Boolean);
    return blocks.map((block, j) => {
      const lines = block.split("\n");
      const isList = lines.every(l => l.trim().startsWith("- "));
      if (isList) {
        return (
          <ul key={`${i}-${j}`} className="list-disc pl-5 space-y-1 my-2 text-sm leading-relaxed">
            {lines.map((l, k) => <li key={k}>{renderInline(l.replace(/^\s*-\s+/, ""))}</li>)}
          </ul>
        );
      }
      return (
        <p key={`${i}-${j}`} className="text-sm leading-relaxed my-2">
          {renderInline(block)}
        </p>
      );
    });
  });
}

function renderInline(s: string) {
  // **bold** and `code`
  const tokens: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(s)) !== null) {
    if (m.index > last) tokens.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      tokens.push(<strong key={key++} className="font-semibold text-foreground">{tok.slice(2, -2)}</strong>);
    } else {
      tokens.push(<code key={key++} className="px-1 py-0.5 rounded bg-muted text-accent text-[12px] font-mono">{tok.slice(1, -1)}</code>);
    }
    last = m.index + tok.length;
  }
  if (last < s.length) tokens.push(s.slice(last));
  return tokens;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
  alreadyCompleted: boolean;
}

function QuizRunner({ questions, onComplete, alreadyCompleted }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0),
    [answers, questions]
  );
  const allAnswered = Object.keys(answers).length === questions.length;
  const passed = submitted && score / questions.length >= 0.6;

  const handleSubmit = () => {
    setSubmitted(true);
    if (score / questions.length >= 0.6 && !alreadyCompleted) onComplete();
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const picked = answers[qi];
        const correct = q.answer;
        return (
          <div key={qi} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-sm font-medium mb-3">
              <span className="text-muted-foreground mr-2">Q{qi + 1}.</span>{q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isPicked = picked === oi;
                const showCorrect = submitted && oi === correct;
                const showWrong = submitted && isPicked && oi !== correct;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                    className={`w-full text-left text-sm p-2.5 rounded-lg border transition flex items-center gap-2
                      ${showCorrect ? "border-accent bg-accent/10 text-foreground" :
                        showWrong ? "border-destructive bg-destructive/10 text-foreground" :
                        isPicked ? "border-primary bg-primary/5" :
                        "border-border/60 hover:border-primary/40 hover:bg-muted/40"}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px] font-semibold shrink-0">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showCorrect && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                    {showWrong && <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <Button className="btn-gradient" disabled={!allAnswered} onClick={handleSubmit}>
          Submit answers
        </Button>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold">
              You scored {score} / {questions.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {passed ? "Nice work — lesson marked complete." : "Score 60% or more to complete this lesson."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-2" /> Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export function LessonContent({
  lesson,
  enrolled,
  isDone,
  onComplete,
}: {
  lesson: Lesson;
  enrolled: boolean;
  isDone: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px] capitalize">{lesson.type}</Badge>
        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
        {isDone && <Badge className="bg-accent/15 text-accent hover:bg-accent/15 text-[10px]">Completed</Badge>}
      </div>

      {lesson.type === "text" && (
        <>
          <div className="prose-sm max-w-none">{renderText(lesson.content)}</div>
          {enrolled && (
            <Button onClick={onComplete} variant={isDone ? "outline" : "default"} className={isDone ? "" : "btn-gradient"}>
              {isDone ? "Mark incomplete" : "Mark as complete"}
            </Button>
          )}
        </>
      )}

      {lesson.type === "quiz" && (
        <>
          <p className="text-sm text-muted-foreground">{lesson.content}</p>
          {enrolled ? (
            <QuizRunner questions={lesson.questions} onComplete={onComplete} alreadyCompleted={isDone} />
          ) : (
            <p className="text-sm text-muted-foreground">Enroll in this course to take the quiz.</p>
          )}
        </>
      )}
    </div>
  );
}
