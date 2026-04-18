// Mock data for the LMS module
export type Role = "admin" | "teacher" | "student";

export interface LmsUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "text";
  duration: string; // e.g. "12 min"
  content: string; // mock body / url
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  /** subject name(s) this course is linked to in the timetable */
  linkedSubjects: string[];
  coverGradient: string;
  chapters: Chapter[];
}

export const MOCK_USERS: LmsUser[] = [
  { id: "u-admin", name: "Asha Admin", email: "admin@campus.edu", role: "admin" },
  { id: "u-teach", name: "Prof. Ravi Kumar", email: "ravi@campus.edu", role: "teacher" },
  { id: "u-stud", name: "Sara Student", email: "sara@campus.edu", role: "student" },
];

const lesson = (id: string, title: string, type: Lesson["type"], duration: string, content: string): Lesson => ({
  id, title, type, duration, content,
});

export const MOCK_COURSES: Course[] = [
  {
    id: "c-web",
    title: "Full-Stack Web Development",
    description: "Build modern web apps with React, Node, and databases.",
    category: "Engineering",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["Web Technologies", "WT", "Web Development"],
    coverGradient: "linear-gradient(135deg, hsl(225 65% 25%), hsl(12 90% 62%))",
    chapters: [
      {
        id: "ch-1",
        title: "Foundations of the Web",
        lessons: [
          lesson("l-1", "How the Web Works", "video", "10 min", "Mock video about HTTP, DNS and browsers."),
          lesson("l-2", "HTML & Semantic Markup", "text", "8 min", "Semantic tags create meaningful, accessible documents."),
          lesson("l-3", "CSS Layout Cheatsheet", "pdf", "5 min", "A printable PDF of flex/grid recipes."),
        ],
      },
      {
        id: "ch-2",
        title: "React Essentials",
        lessons: [
          lesson("l-4", "Components & Props", "video", "14 min", "Mock video covering component composition."),
          lesson("l-5", "State & Effects", "text", "12 min", "useState and useEffect with practical patterns."),
          lesson("l-6", "Routing in React", "video", "9 min", "React Router walkthrough."),
        ],
      },
    ],
  },
  {
    id: "c-ai",
    title: "AI Basics",
    description: "Intuitive introduction to machine learning and modern AI.",
    category: "Computer Science",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["Artificial Intelligence", "AI", "Machine Learning"],
    coverGradient: "linear-gradient(135deg, hsl(245 60% 35%), hsl(12 90% 62%))",
    chapters: [
      {
        id: "ch-1",
        title: "What is AI?",
        lessons: [
          lesson("l-1", "A Brief History of AI", "text", "7 min", "From perceptrons to LLMs."),
          lesson("l-2", "Types of Machine Learning", "video", "11 min", "Supervised, unsupervised, reinforcement."),
        ],
      },
      {
        id: "ch-2",
        title: "Neural Networks",
        lessons: [
          lesson("l-3", "Neurons and Layers", "video", "13 min", "How a neural network learns."),
          lesson("l-4", "Training Loop PDF", "pdf", "6 min", "Backprop reference sheet."),
        ],
      },
    ],
  },
  {
    id: "c-dbms",
    title: "Database Management Systems",
    description: "Relational modeling, SQL, normalization, and transactions.",
    category: "Computer Science",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["DBMS", "Database Management Systems", "Databases"],
    coverGradient: "linear-gradient(135deg, hsl(225 65% 25%), hsl(245 60% 35%))",
    chapters: [
      {
        id: "ch-1",
        title: "Relational Model",
        lessons: [
          lesson("l-1", "Tables, Keys, and Relationships", "text", "9 min", "Primary, foreign, candidate keys explained."),
          lesson("l-2", "Intro to SQL", "video", "15 min", "SELECT, JOIN, GROUP BY in practice."),
        ],
      },
      {
        id: "ch-2",
        title: "Normalization",
        lessons: [
          lesson("l-3", "1NF, 2NF, 3NF", "text", "10 min", "Eliminate redundancy step by step."),
          lesson("l-4", "Transactions & ACID", "video", "12 min", "Why your bank cares about isolation levels."),
        ],
      },
    ],
  },
  {
    id: "c-os",
    title: "Operating Systems",
    description: "Processes, memory, file systems and concurrency.",
    category: "Computer Science",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["Operating Systems", "OS"],
    coverGradient: "linear-gradient(135deg, hsl(12 90% 62%), hsl(25 95% 55%))",
    chapters: [
      {
        id: "ch-1",
        title: "Processes & Threads",
        lessons: [
          lesson("l-1", "Process Lifecycle", "text", "8 min", "New, ready, running, waiting, terminated."),
          lesson("l-2", "Threading Models", "video", "11 min", "User vs kernel threads."),
        ],
      },
    ],
  },
];

export const findCourseByLessonSubject = (subjectName?: string): Course | undefined => {
  if (!subjectName) return undefined;
  const n = subjectName.toLowerCase().trim();
  return MOCK_COURSES.find(c =>
    c.linkedSubjects.some(s => s.toLowerCase() === n) ||
    c.title.toLowerCase().includes(n) ||
    n.includes(c.title.toLowerCase().split(" ")[0])
  );
};
