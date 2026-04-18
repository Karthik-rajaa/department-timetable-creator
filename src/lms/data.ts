// Mock data for the LMS module — beginner text + quiz content (W3Schools style)
export type Role = "admin" | "teacher" | "student";

export interface LmsUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  explanation?: string;
}

export type Lesson =
  | {
      id: string;
      title: string;
      type: "text";
      duration: string;
      /** Markdown-ish body. Supports simple ```code``` fences and blank-line paragraphs. */
      content: string;
    }
  | {
      id: string;
      title: string;
      type: "quiz";
      duration: string;
      content: string; // intro
      questions: QuizQuestion[];
    };

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
  linkedSubjects: string[];
  coverGradient: string;
  chapters: Chapter[];
}

export const MOCK_USERS: LmsUser[] = [
  { id: "u-admin", name: "Asha Admin", email: "admin@campus.edu", role: "admin" },
  { id: "u-teach", name: "Prof. Ravi Kumar", email: "ravi@campus.edu", role: "teacher" },
  { id: "u-stud", name: "Sara Student", email: "sara@campus.edu", role: "student" },
];

const text = (id: string, title: string, duration: string, content: string): Lesson => ({
  id, title, type: "text", duration, content,
});

const quiz = (id: string, title: string, duration: string, content: string, questions: QuizQuestion[]): Lesson => ({
  id, title, type: "quiz", duration, content, questions,
});

export const MOCK_COURSES: Course[] = [
  // ============================== HTML ==============================
  {
    id: "c-html",
    title: "HTML Basics",
    description: "Learn the language of the web — structure pages with tags, attributes and semantic elements.",
    category: "Web",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["HTML", "Web Technologies"],
    coverGradient: "linear-gradient(135deg, hsl(12 90% 62%), hsl(25 95% 55%))",
    chapters: [
      {
        id: "ch-1",
        title: "Getting Started",
        lessons: [
          text("l-1", "What is HTML?", "5 min",
`HTML stands for **HyperText Markup Language**. It is the standard language used to create web pages.

Every web page you visit is built with HTML. It tells the browser what to display: headings, paragraphs, images, links, and more.

A minimal HTML document looks like this:

\`\`\`
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first paragraph.</p>
  </body>
</html>
\`\`\`

Key parts:
- \`<!DOCTYPE html>\` tells the browser this is HTML5.
- \`<html>\` wraps the entire page.
- \`<head>\` contains meta info (title, links to CSS).
- \`<body>\` contains everything visible on the page.`),
          text("l-2", "Tags, Elements & Attributes", "6 min",
`HTML is made of **tags**. Most tags come in pairs — an opening tag and a closing tag:

\`\`\`
<p>This is a paragraph.</p>
\`\`\`

A tag plus its content is called an **element**.

**Attributes** add extra information to a tag. They go inside the opening tag as \`name="value"\`:

\`\`\`
<a href="https://example.com">Visit Example</a>
<img src="logo.png" alt="Site logo">
\`\`\`

Common attributes:
- \`href\` — link destination
- \`src\` — image source
- \`alt\` — alternative text for images
- \`id\` and \`class\` — used for styling and scripting`),
          text("l-3", "Headings, Paragraphs & Text", "5 min",
`HTML has six heading levels, from \`<h1>\` (most important) to \`<h6>\`:

\`\`\`
<h1>Main title</h1>
<h2>Section title</h2>
<h3>Sub-section</h3>
\`\`\`

Use \`<p>\` for paragraphs, \`<br>\` for a line break, and \`<hr>\` for a horizontal divider.

Inline text formatting:
- \`<strong>\` — important (bold)
- \`<em>\` — emphasis (italic)
- \`<mark>\` — highlighted
- \`<small>\` — small print`),
        ],
      },
      {
        id: "ch-2",
        title: "Links, Images & Lists",
        lessons: [
          text("l-4", "Links and Images", "6 min",
`A **link** uses the \`<a>\` tag. The \`href\` attribute holds the URL:

\`\`\`
<a href="about.html">About us</a>
<a href="https://google.com" target="_blank">Open Google</a>
\`\`\`

\`target="_blank"\` opens the link in a new tab.

An **image** uses the self-closing \`<img>\` tag:

\`\`\`
<img src="cat.jpg" alt="A sleepy cat" width="300">
\`\`\`

Always include \`alt\` text — it describes the image for screen readers and shows if the image fails to load.`),
          text("l-5", "Lists", "4 min",
`HTML has three list types.

**Unordered list** — bullet points:
\`\`\`
<ul>
  <li>Apples</li>
  <li>Bananas</li>
</ul>
\`\`\`

**Ordered list** — numbered:
\`\`\`
<ol>
  <li>Wake up</li>
  <li>Code</li>
  <li>Sleep</li>
</ol>
\`\`\`

**Description list**:
\`\`\`
<dl>
  <dt>HTML</dt>
  <dd>Markup language</dd>
</dl>
\`\`\``),
          quiz("l-6", "Quiz: HTML Basics", "5 min",
"Test what you learned about HTML tags, attributes and lists.",
[
  { q: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "HyperText Markup Language", "Home Tool Markup Language", "HyperText Machine Language"], answer: 1 },
  { q: "Which tag creates the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
  { q: "Which attribute specifies the destination of a link?", options: ["src", "link", "url", "href"], answer: 3 },
  { q: "Which tag is used for an unordered list?", options: ["<ol>", "<ul>", "<list>", "<li>"], answer: 1 },
  { q: "Which attribute provides alt text for an image?", options: ["title", "src", "alt", "caption"], answer: 2 },
]),
        ],
      },
    ],
  },

  // ============================== CSS ==============================
  {
    id: "c-css",
    title: "CSS Basics",
    description: "Style your web pages — colors, fonts, layout with Flexbox, and the box model.",
    category: "Web",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["CSS", "Web Technologies"],
    coverGradient: "linear-gradient(135deg, hsl(225 65% 25%), hsl(245 60% 35%))",
    chapters: [
      {
        id: "ch-1",
        title: "CSS Foundations",
        lessons: [
          text("l-1", "What is CSS?", "5 min",
`**CSS** stands for **Cascading Style Sheets**. It controls how HTML looks — colors, fonts, spacing, and layout.

You can add CSS in three ways:

1. **Inline** — directly on an element:
\`\`\`
<p style="color: red;">Red text</p>
\`\`\`

2. **Internal** — inside a \`<style>\` tag in the \`<head>\`:
\`\`\`
<style>
  p { color: red; }
</style>
\`\`\`

3. **External** — in a separate \`.css\` file (recommended):
\`\`\`
<link rel="stylesheet" href="styles.css">
\`\`\`

A CSS rule looks like this:
\`\`\`
selector {
  property: value;
}
\`\`\``),
          text("l-2", "Selectors", "6 min",
`Selectors tell the browser **which elements** to style.

- **Element selector** — \`p { color: blue; }\` styles every \`<p>\`.
- **Class selector** — starts with \`.\` and matches any element with that class:
\`\`\`
.btn { background: orange; }
\`\`\`
\`\`\`
<button class="btn">Click</button>
\`\`\`
- **ID selector** — starts with \`#\` and matches one unique element:
\`\`\`
#header { padding: 20px; }
\`\`\`
- **Group selector** — comma-separated list:
\`\`\`
h1, h2, h3 { font-family: Arial; }
\`\`\``),
          text("l-3", "Colors, Fonts & Text", "5 min",
`**Colors** can be named, hex, rgb, or hsl:
\`\`\`
color: red;
color: #ff0000;
color: rgb(255, 0, 0);
color: hsl(0, 100%, 50%);
\`\`\`

**Fonts**:
\`\`\`
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
}
\`\`\`

**Text alignment**: \`text-align: left | center | right | justify;\``),
        ],
      },
      {
        id: "ch-2",
        title: "Box Model & Layout",
        lessons: [
          text("l-4", "The Box Model", "6 min",
`Every HTML element is a **box** made of four layers (from inside out):

1. **Content** — the text or image
2. **Padding** — space inside the box, around the content
3. **Border** — the line around the padding
4. **Margin** — space outside the border

\`\`\`
.card {
  padding: 16px;
  border: 1px solid #ccc;
  margin: 10px;
}
\`\`\`

Use \`box-sizing: border-box;\` so width includes padding and border (much easier).`),
          text("l-5", "Flexbox in 5 Minutes", "5 min",
`Flexbox makes layout easy. Make any container a flex container:

\`\`\`
.row {
  display: flex;
  gap: 10px;
  justify-content: center; /* horizontal */
  align-items: center;     /* vertical */
}
\`\`\`

Useful values for \`justify-content\`:
- \`flex-start\` (default)
- \`center\`
- \`space-between\`
- \`space-around\`

Children can grow to fill space:
\`\`\`
.item { flex: 1; }
\`\`\``),
          quiz("l-6", "Quiz: CSS Basics", "5 min",
"Check your understanding of selectors, the box model, and Flexbox.",
[
  { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 1 },
  { q: "Which symbol selects by class?", options: ["#", ".", "@", "$"], answer: 1 },
  { q: "Which property adds space INSIDE an element, around the content?", options: ["margin", "border", "padding", "spacing"], answer: 2 },
  { q: "How do you make a container a flex container?", options: ["display: flexbox", "layout: flex", "display: flex", "flex: on"], answer: 2 },
  { q: "Which property centers items vertically in a flex container?", options: ["justify-content", "align-items", "vertical-align", "text-align"], answer: 1 },
]),
        ],
      },
    ],
  },

  // ============================== Python ==============================
  {
    id: "c-python",
    title: "Python for Beginners",
    description: "Get started with Python — variables, conditions, loops and functions.",
    category: "Programming",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["Python", "Programming"],
    coverGradient: "linear-gradient(135deg, hsl(225 65% 25%), hsl(12 90% 62%))",
    chapters: [
      {
        id: "ch-1",
        title: "First Steps",
        lessons: [
          text("l-1", "Why Python?", "4 min",
`Python is a beginner-friendly programming language. It is used in **web development, data science, AI, automation** and more.

Python code is short and reads almost like English:

\`\`\`
print("Hello, World!")
\`\`\`

That's a complete Python program. Run it and the text appears on the screen.

You don't need semicolons or curly braces. Python uses **indentation** to group code.`),
          text("l-2", "Variables & Data Types", "6 min",
`A **variable** stores a value. Just pick a name and assign:

\`\`\`
name = "Sara"
age = 21
height = 1.65
is_student = True
\`\`\`

Common data types:
- **str** — text, like \`"hello"\`
- **int** — whole numbers, like \`42\`
- **float** — decimals, like \`3.14\`
- **bool** — \`True\` or \`False\`
- **list** — ordered collection, like \`[1, 2, 3]\`

You can check a type with \`type(x)\` and convert with \`int("5")\`, \`str(10)\`, etc.`),
          text("l-3", "Input & Output", "4 min",
`Show something on screen with \`print()\`:

\`\`\`
print("Welcome!")
print("2 + 2 =", 2 + 2)
\`\`\`

Read from the user with \`input()\`:

\`\`\`
name = input("What is your name? ")
print("Hello,", name)
\`\`\`

\`input()\` always returns a **string**. Convert it if you need a number:

\`\`\`
age = int(input("Age? "))
\`\`\``),
        ],
      },
      {
        id: "ch-2",
        title: "Control Flow & Functions",
        lessons: [
          text("l-4", "If, Elif, Else", "5 min",
`Make decisions with \`if\`:

\`\`\`
age = 18
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")
\`\`\`

Comparison operators: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
Logical operators: \`and\`, \`or\`, \`not\`

Indentation matters — the indented block is what runs when the condition is true.`),
          text("l-5", "Loops & Functions", "7 min",
`**For loop** — repeat for each item:
\`\`\`
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

for i in range(5):   # 0, 1, 2, 3, 4
    print(i)
\`\`\`

**While loop** — repeat while a condition is true:
\`\`\`
n = 0
while n < 3:
    print(n)
    n = n + 1
\`\`\`

**Functions** — reusable blocks of code:
\`\`\`
def greet(name):
    return "Hello, " + name

print(greet("Sara"))
\`\`\``),
          quiz("l-6", "Quiz: Python Basics", "5 min",
"A short quiz on variables, conditions, loops and functions.",
[
  { q: "Which function prints to the screen?", options: ["echo()", "print()", "console.log()", "show()"], answer: 1 },
  { q: "What is the data type of `True`?", options: ["str", "int", "bool", "float"], answer: 2 },
  { q: "What does `range(3)` produce?", options: ["1, 2, 3", "0, 1, 2, 3", "0, 1, 2", "0, 1, 2, 3, 4"], answer: 2 },
  { q: "Which keyword defines a function?", options: ["function", "def", "func", "lambda"], answer: 1 },
  { q: "How does Python group code blocks?", options: ["Curly braces { }", "Parentheses ( )", "Indentation", "Semicolons"], answer: 2 },
]),
        ],
      },
    ],
  },

  // ============================== Java ==============================
  {
    id: "c-java",
    title: "Java for Beginners",
    description: "Learn Java fundamentals — syntax, variables, control flow and methods.",
    category: "Programming",
    instructor: "Prof. Ravi Kumar",
    linkedSubjects: ["Java", "Programming"],
    coverGradient: "linear-gradient(135deg, hsl(245 60% 35%), hsl(12 90% 62%))",
    chapters: [
      {
        id: "ch-1",
        title: "Java Essentials",
        lessons: [
          text("l-1", "What is Java?", "5 min",
`**Java** is a popular, statically-typed programming language. It's used for Android apps, enterprise systems, and large back-end services.

Java code is **compiled** to bytecode and runs on the **JVM** (Java Virtual Machine). That's why Java runs on almost any device — "write once, run anywhere".

A minimal Java program:

\`\`\`
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

Every Java program starts in the \`main\` method. \`System.out.println\` prints a line of text.`),
          text("l-2", "Variables & Data Types", "6 min",
`Java is **statically typed** — you declare a type before the name.

\`\`\`
int age = 21;
double height = 1.65;
char grade = 'A';
boolean isStudent = true;
String name = "Sara";
\`\`\`

Common types:
- **int** — whole numbers
- **double** — decimals
- **char** — a single character (single quotes)
- **boolean** — true / false
- **String** — text (double quotes)

Once a variable has a type, you can't store a different type in it.`),
          text("l-3", "Operators & Output", "5 min",
`Arithmetic: \`+ - * / %\`
Comparison: \`== != < > <= >=\`
Logical: \`&& || !\`

Strings join with \`+\`:

\`\`\`
String name = "Sara";
int age = 21;
System.out.println("Hi " + name + ", age " + age);
\`\`\`

Use \`System.out.print\` (no newline) or \`System.out.println\` (with newline).`),
        ],
      },
      {
        id: "ch-2",
        title: "Control Flow & Methods",
        lessons: [
          text("l-4", "If, Else & Switch", "5 min",
`\`\`\`
int score = 75;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 60) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}
\`\`\`

A **switch** is good for many discrete cases:

\`\`\`
switch (day) {
    case 1: System.out.println("Mon"); break;
    case 2: System.out.println("Tue"); break;
    default: System.out.println("Other");
}
\`\`\``),
          text("l-5", "Loops & Methods", "7 min",
`**For loop**:
\`\`\`
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
\`\`\`

**While loop**:
\`\`\`
int n = 0;
while (n < 3) {
    System.out.println(n);
    n++;
}
\`\`\`

**Methods** are reusable blocks of code:
\`\`\`
public static int add(int a, int b) {
    return a + b;
}

// usage:
int sum = add(2, 3); // 5
\`\`\`

\`int\` before the name is the **return type**. Use \`void\` if the method returns nothing.`),
          quiz("l-6", "Quiz: Java Basics", "5 min",
"A short quiz on Java syntax, types and methods.",
[
  { q: "Which method is the entry point of every Java program?", options: ["start()", "run()", "main()", "init()"], answer: 2 },
  { q: "Which type stores text in Java?", options: ["text", "String", "char", "str"], answer: 1 },
  { q: "Which symbol ends a statement in Java?", options: [".", ",", ";", ":"], answer: 2 },
  { q: "What is the return type of a method that returns nothing?", options: ["null", "none", "void", "empty"], answer: 2 },
  { q: "Which loop is best when you know the exact number of iterations?", options: ["while", "do-while", "for", "forever"], answer: 2 },
]),
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
