import { Terminal, Box, Layers, PlaySquare, Grid, Type, Clock, Repeat } from "lucide-react"

export type LessonType = 'concept' | 'practice'

export interface Lesson {
  id: string
  title: string
  type: LessonType
  description: string
  tldr?: string
  code?: string
  difficulty?: string
  xpReward?: number
  icon?: any
  color?: string
}

export interface Chapter {
  id: string
  title: string
  concepts: Lesson[]
  problems: Lesson[]
  missions?: Lesson[]
}

export interface Part {
  id: string
  title: string
  chapters: Chapter[]
}

// Java Purple Theme
const PURPLE = "#a855f7"

export const javaCourseCurriculum: Part[] = [
  {
    id: "java-part-1",
    title: "PART I — Java Foundations",
    chapters: [
      {
        id: "java-ch-1",
        title: "Chapter 1 — Introduction to Java",
        concepts: [
          {
            id: "java-1-1",
            title: "Programming Basics & Problem Solving",
            type: "concept",
            tldr: "Learn how to think like a compiler and break down real-world problems into programmable steps.",
            description: "Programming is the act of instructing a computer to perform specific tasks. Before writing code, you must understand the problem, break it down using pseudocode or flowcharts, and determine the optimal sequence of actions.\n\nIn Java, every problem is solved within objects and methods, emphasizing structure and clarity.",
            icon: Terminal,
            color: PURPLE,
          },
          {
            id: "java-1-2",
            title: "Java Ecosystem: JDK, JRE, JVM",
            type: "concept",
            tldr: "The Holy Trinity of Java: The Kit, The Environment, and The Machine.",
            description: "**JDK (Java Development Kit)**: Contains everything needed to write and compile Java (including JRE and compilers).\n\n**JRE (Java Runtime Environment)**: Provides the libraries and execution environment to run Java applications.\n\n**JVM (Java Virtual Machine)**: The engine that executes Java bytecode, making Java 'Write Once, Run Anywhere' (Platform Independent).",
            icon: Layers,
            color: PURPLE,
          },
          {
            id: "java-1-3",
            title: "Compilation & Execution Process",
            type: "concept",
            tldr: "How your human-readable code becomes machine-executable instructions.",
            description: "1. You write `.java` files (Source Code).\n2. The compiler (`javac`) translates source code into `.class` files containing **Bytecode**.\n3. The JVM understands Bytecode and runs it on the host operating system.",
            code: "javac HelloWorld.java  // Compiles source to bytecode\njava HelloWorld        // Executes the bytecode via JVM",
            icon: PlaySquare,
            color: PURPLE,
          },
          {
            id: "java-1-4",
            title: "Writing Your First Java Program",
            type: "concept",
            tldr: "The classic Hello World inside Java's class-based structure.",
            description: "Every Java program must have at least one class and a `main` method. The `main` method is the entry point of your application.",
            code: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
            icon: Terminal,
            color: PURPLE,
          },
          {
            id: "java-1-5",
            title: "Input/Output using Scanner",
            type: "concept",
            tldr: "Interact with the user via the command line.",
            description: "Java uses the `Scanner` class to read input from the console (`System.in`). Make sure to import it from `java.util`.",
            code: "import java.util.Scanner;\n\npublic class InputExample {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.print(\"Enter your name: \");\n        String name = scanner.nextLine();\n        System.out.println(\"Welcome, \" + name + \"!\");\n    }\n}",
            icon: Box,
            color: PURPLE,
          }
        ],
        problems: [],
        missions: [
          {
            id: "java-mission-1",
            title: "Build a User Greeter",
            type: "practice",
            description: "Create a program that asks the user for their name and age using `Scanner`, then prints out a formatted greeting message.",
            difficulty: "EASY",
            xpReward: 100,
            icon: Terminal,
            color: PURPLE,
          }
        ]
      },
      {
        id: "java-ch-2",
        title: "Chapter 2 — Data Types and Variables",
        concepts: [
          {
            id: "java-2-1",
            title: "Primitive Data Types",
            type: "concept",
            tldr: "The foundational building blocks of data in Java memory.",
            description: "Java has 8 primitive data types:\n- **Whole numbers**: byte (1 byte), short (2 bytes), int (4 bytes), long (8 bytes)\n- **Decimals**: float (4 bytes), double (8 bytes)\n- **Characters**: char (2 bytes)\n- **Truth values**: boolean (1 bit)",
            icon: Box,
            color: PURPLE,
          },
          {
            id: "java-2-2",
            title: "Variables and Memory Usage",
            type: "concept",
            tldr: "Named memory locations holding your data.",
            description: "A variable must be declared with its type before it can be used. Java is a strongly typed language.",
            code: "int age = 25;\ndouble price = 19.99;\nboolean isActive = true;\nchar grade = 'A';",
            icon: Layers,
            color: PURPLE,
          },
          {
            id: "java-2-3",
            title: "Type Casting",
            type: "concept",
            tldr: "Converting a variable of one type to another.",
            description: "**Implicit Casting (Widening)**: Automatic. Smaller type to larger type (e.g., int to double).\n\n**Explicit Casting (Narrowing)**: Manual. Larger type to smaller type (e.g., double to int). Risk of data loss.",
            code: "int myInt = 9;\ndouble myDouble = myInt; // Automatic casting: int to double\n\ndouble pi = 3.14;\nint approxPi = (int) pi; // Manual casting: double to int (loses .14)",
            icon: Repeat,
            color: PURPLE,
          },
          {
            id: "java-2-4",
            title: "Operators",
            type: "concept",
            tldr: "Arithmetic, Logical, and Relational tools for manipulating data.",
            description: "**Arithmetic**: `+`, `-`, `*`, `/`, `%`\n**Relational**: `==`, `!=`, `>`, `<`, `>=`, `<=`\n**Logical**: `&&` (AND), `||` (OR), `!` (NOT)",
            icon: Terminal,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-3",
        title: "Chapter 3 — Control Flow",
        concepts: [
          {
            id: "java-3-1",
            title: "Conditional statements (if, switch)",
            type: "concept",
            tldr: "Branching logic paths based on boolean conditions.",
            description: "Use `if-else` for complex conditions or ranges, and `switch` for testing a single variable against strict values (especially useful in modern Java with enhanced switch expressions).",
            code: "int score = 85;\nif (score >= 90) {\n    System.out.println(\"A\");\n} else {\n    System.out.println(\"B\");\n}\n\n// Switch\nint day = 3;\nswitch (day) {\n  case 1: System.out.println(\"Monday\"); break;\n  case 2: System.out.println(\"Tuesday\"); break;\n  default: System.out.println(\"Unknown\");\n}",
            icon: PlaySquare,
            color: PURPLE,
          },
          {
            id: "java-3-2",
            title: "Loops (for, while, do-while)",
            type: "concept",
            tldr: "Executing code blocks repeatedly without writing redundant code.",
            description: "**for loop**: Best when you know exactly how many times you want to iterate.\n**while loop**: Best when the condition to stop is dynamic.\n**do-while**: Guaranteed to execute the block at least once.",
            icon: Repeat,
            color: PURPLE,
          },
          {
            id: "java-3-3",
            title: "Break and Continue",
            type: "concept",
            tldr: "Fine control over loop execution paths.",
            description: "`break` immediately forces an exit from the loop completely.\n`continue` stops the current iteration and jumps immediately to the next loop evaluation.",
            icon: Terminal,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-4",
        title: "Chapter 4 — Methods",
        concepts: [
          {
            id: "java-4-1",
            title: "Method Creation and Usage",
            type: "concept",
            tldr: "Blocks of code that perform specific actions, executing only when called.",
            description: "Methods help in code reusability. They must be declared inside a class.",
            code: "public static void sayHello() {\n    System.out.println(\"Hello!\");\n}\n\npublic static void main(String[] args) {\n    sayHello(); // Calling the method\n}",
            icon: Box,
            color: PURPLE,
          },
          {
            id: "java-4-2",
            title: "Parameters and Return Types",
            type: "concept",
            tldr: "Passing data in and getting data out.",
            description: "Methods can accept arguments (parameters) and must declare what type of data they return (or `void` if nothing).",
            code: "public static int add(int a, int b) {\n    return a + b;\n}",
            icon: Repeat,
            color: PURPLE,
          },
          {
            id: "java-4-3",
            title: "Method Overloading",
            type: "concept",
            tldr: "Multiple methods sharing a name but having different parameter signatures.",
            description: "Overloading allows functions that conceptually do the same thing to handle different data types or quantities.",
            code: "int add(int a, int b) { return a + b; }\ndouble add(double a, double b) { return a + b; }\nint add(int a, int b, int c) { return a + b + c; }",
            icon: Layers,
            color: PURPLE,
          },
          {
            id: "java-4-4",
            title: "Pass by Value Concept",
            type: "concept",
            tldr: "Java ALWAYS passes arguments by value, never by reference.",
            description: "When you pass a primitive, Java gives the method a *copy* of the bits. When you pass an Object, Java passes a *copy of the reference* to that object.",
            icon: Terminal,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-5",
        title: "Chapter 5 — Arrays",
        concepts: [
          {
            id: "java-5-1",
            title: "1D and 2D Arrays",
            type: "concept",
            tldr: "Continuous memory structures holding sequences of identical data types.",
            description: "Arrays have a fixed size once initialized.",
            code: "int[] numbers = {1, 2, 3};\nint[][] matrix = { {1, 2}, {3, 4} };",
            icon: Grid,
            color: PURPLE,
          },
          {
            id: "java-5-2",
            title: "Traversal and Manipulation",
            type: "concept",
            tldr: "Using loops to read and alter array data.",
            description: "You can use standard `for` loops or the enhanced `for-each` loop.",
            code: "for (int num : numbers) {\n    System.out.println(num);\n}",
            icon: Repeat,
            color: PURPLE,
          },
          {
            id: "java-5-3",
            title: "Common Array Problems",
            type: "concept",
            tldr: "Finding max, min, reversing, and sliding windows.",
            description: "These patterns are the foundation of all algorithmic coding interviews.",
            icon: Box,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-6",
        title: "Chapter 6 — Strings",
        concepts: [
          {
            id: "java-6-1",
            title: "String Immutability Concept",
            type: "concept",
            tldr: "In Java, String objects can never be changed after creation.",
            description: "Modifying a string actually creates an entirely new Object in the String Pool, making aggressive concatenation very slow.",
            icon: Type,
            color: PURPLE,
          },
          {
            id: "java-6-2",
            title: "String vs StringBuilder",
            type: "concept",
            tldr: "Use StringBuilder for building strings dynamically in loops.",
            description: "`StringBuilder` is mutable. It maintains a resizable character array, saving memory and CPU cycles.",
            code: "StringBuilder sb = new StringBuilder(\"Hello\");\nsb.append(\" World\");\nSystem.out.println(sb.toString());",
            icon: Layers,
            color: PURPLE,
          },
          {
            id: "java-6-3",
            title: "String Operations",
            type: "concept",
            tldr: "Methods like substring(), indexOf(), split().",
            description: "Java provides powerful built-in methods on the String object for manipulation and parsing.",
            icon: Terminal,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-7",
        title: "Chapter 7 — Complexity",
        concepts: [
          {
            id: "java-7-1",
            title: "Time Complexity (Big-O)",
            type: "concept",
            tldr: "How algorithm execution time grows relative to input size.",
            description: "Common classes: O(1) Constant, O(log N) Logarithmic, O(N) Linear, O(N^2) Quadratic.",
            icon: Clock,
            color: PURPLE,
          },
          {
            id: "java-7-2",
            title: "Space Complexity",
            type: "concept",
            tldr: "How much extra memory an algorithm demands.",
            description: "Creating full copies of arrays inside loops? That's awful space complexity.",
            icon: Box,
            color: PURPLE,
          },
          {
            id: "java-7-3",
            title: "Analyzing Loops",
            type: "concept",
            tldr: "Counting the operations in nested loops.",
            description: "If an inner loop runs N times for every N iterations of an outer loop, you have an O(N^2) algorithm.",
            icon: Layers,
            color: PURPLE,
          }
        ],
        problems: []
      },
      {
        id: "java-ch-8",
        title: "Chapter 8 — Recursion",
        concepts: [
          {
            id: "java-8-1",
            title: "Recursive Functions",
            type: "concept",
            tldr: "A method that calls itself to solve smaller pieces of a problem.",
            description: "Recursion is perfect for tree traversal and divide-and-conquer algorithms like Merge Sort.",
            icon: Repeat,
            color: PURPLE,
          },
          {
            id: "java-8-2",
            title: "Base and Recursive Cases",
            type: "concept",
            tldr: "Without a base case, recursion leads to StackOverflow.",
            description: "The **Base Case** defines when the method should stop calling itself. The **Recursive Case** breaks the problem down.",
            code: "public int factorial(int n) {\n    if (n == 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive case\n}",
            icon: PlaySquare,
            color: PURPLE,
          },
          {
            id: "java-8-3",
            title: "Call Stack Behavior",
            type: "concept",
            tldr: "How the JVM manages memory during deep recursion.",
            description: "Every recursive call pushes a new frame onto the Stack memory holding local variables. Resolving calls pops them off.",
            icon: Layers,
            color: PURPLE,
          }
        ],
        problems: []
      }
    ]
  }
]

export const javaCourseInfo = {
  title: "Java for Beginners",
  subtitle: "Master the foundations of enterprise programming with Java. Build a solid grasp of OOP, syntax, and computational thinking.",
  totalLessons: javaCourseCurriculum[0].chapters.reduce((acc, curr) => acc + curr.concepts.length, 0),
  difficulty: "Beginner",
  estimatedTime: "2-4 Weeks"
}
