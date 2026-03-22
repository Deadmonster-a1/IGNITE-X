import { BookOpen, Code2, Database, TerminalSquare, LayoutGrid, Layers, Sigma, Network } from "lucide-react"

export type LessonType = 'concept' | 'practice'

export interface Lesson {
  id: string
  title: string
  type: LessonType
  tldr: string
  description: string
  code?: string
  xpReward?: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  icon?: React.ElementType
  color?: string
}

export interface Chapter {
  id: string
  title: string
  concepts: Lesson[]
  missions?: Lesson[]
  problems?: Lesson[]
}

export interface Part {
  id: string
  title: string
  chapters: Chapter[]
}

export const javaIntermediateCourseCurriculum: Part[] = [
  {
    id: "part-2",
    title: "PART II — Core Java + Data Structures",
    chapters: [
      {
        id: "ch-9",
        title: "Chapter 9 — OOP Concepts",
        concepts: [
          {
            id: "java-2-9-1",
            title: "Classes & Objects",
            type: "concept",
            tldr: "The blueprint and the instance. Classes define structure; objects hold state.",
            description: "**Object-Oriented Programming (OOP)** is about creating modular, reusable code. You define blueprints (`classes`) and stamp out customized instances (`objects`).\n\n• **Class**: A template that defines variables and methods.\n• **Object**: A concrete instance of that class in memory.\n\nThe real power of OOP is associating data (state) directly with the methods that operate on it (behavior).",
            code: "class Car {\n    String color;\n    int speed;\n\n    void accelerate() {\n        speed += 10;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car myCar = new Car(); // Object creation\n        myCar.color = \"Red\";\n        myCar.accelerate();\n    }\n}",
            icon: LayoutGrid,
            color: "#a855f7"
          },
          {
            id: "java-2-9-2",
            title: "Encapsulation, Inheritance, Polymorphism",
            type: "concept", // combining them for brevity
            tldr: "The three pillars of robust Object-Oriented design.",
            description: "To master Java architecture, you must internalize the core pillars of OOP:\n\n• **Encapsulation**: Hiding state (using `private` fields) and requiring all access to go through `public` methods (getters/setters). This protects data integrity.\n• **Inheritance**: Creating hierarchical relationships using `extends`. A subclass inherits the methods and fields of its parent, promoting code reuse.\n• **Polymorphism**: Treating derived classes as their base class. The most common form is method overriding, where a subclass provides its own implementation of a parent's method.\n• **Abstraction**: Hiding implementation details using `abstract` classes and `interfaces`.",
            code: "class Animal { // Base class\n    public void makeSound() {\n        System.out.println(\"Some sound\");\n    }\n}\n\nclass Dog extends Animal { // Inheritance\n    @Override\n    public void makeSound() { // Polymorphism\n        System.out.println(\"Bark\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myDog = new Dog(); \n        myDog.makeSound(); // Outputs \"Bark\"\n    }\n}",
            icon: Layers,
            color: "#a855f7"
          }
        ]
      },
      {
        id: "ch-10",
        title: "Chapter 10 — Memory and Constructors",
        concepts: [
          {
            id: "java-2-10-1",
            title: "Stack vs Heap & Garbage Collection",
            type: "concept",
            tldr: "Understanding where Java puts your data and how it cleans it up.",
            description: "Memory management in Java is largely abstracted, but understanding it is critical for performance.\n\n• **Stack**: Stores local variables and method execution frames. It is extremely fast, LIFO (Last-In-First-Out), and thread-specific.\n• **Heap**: Stores all objects (`new Class()`). It is global, slower to allocate, and managed by the Garbage Collector.\n\nWhen objects in the **Heap** are no longer referenced by anything in the **Stack** (or by other active objects), the **Garbage Collector (GC)** automatically destroys them to reclaim memory.",
            code: "public class MemoryExample {\n    public static void main(String[] args) {\n        int localPrimitive = 5; // Stored on the Stack\n        \n        // The reference 'myObject' is on the Stack,\n        // but the actual object data is on the Heap.\n        MyClass myObject = new MyClass(); \n        \n        myObject = null; // Object is now eligible for Garbage Collection.\n    }\n}",
            icon: Database,
            color: "#a855f7"
          },
          {
            id: "java-2-10-2",
            title: "Constructors, 'this', and 'super'",
            type: "concept",
            tldr: "Initializing objects safely and pointing to correct contexts.",
            description: "When an object is created, a **constructor** is called. It sets the initial state of the object.\n\n• **Constructor**: A special method with the exact same name as the class and no return type.\n• **this**: A reference to the current object. Used to distinguish instance variables from local parameters.\n• **super**: A reference to the parent object. Used to call parent constructors or overridden parent methods.",
            code: "class Parent {\n    Parent() {\n        System.out.println(\"Parent Constructor invoked.\");\n    }\n}\n\nclass Child extends Parent {\n    int age;\n\n    Child(int age) {\n        super(); // Calls Parent()\n        this.age = age; // 'this' clarifies instance vs parameter\n    }\n}",
            icon: Code2,
            color: "#a855f7"
          }
        ]
      },
      {
        id: "ch-11",
        title: "Chapter 11 — Collections Framework",
        concepts: [
          {
            id: "java-2-11-1",
            title: "ArrayList, HashMap, and Generics",
            type: "concept",
            tldr: "Dynamic data structures that grow automatically, powered by Generics.",
            description: "The Java Collections Framework provides robust, dynamic data structures.\n\n• **ArrayList**: A dynamic array. It resizes itself automatically. Great for fast random access.\n• **HashMap**: A key-value store. Provides O(1) average lookup times.\n• **Generics (`<T>`)**: Allows you to specify the exact type of object a collection can hold, moving type-checking to compile-time instead of runtime.",
            code: "import java.util.*;\n\npublic class CollectionsDemo {\n    public static void main(String[] args) {\n        // ArrayList with Generics\n        List<String> names = new ArrayList<>();\n        names.add(\"Alice\");\n        names.add(\"Bob\");\n        \n        // HashMap\n        Map<String, Integer> ages = new HashMap<>();\n        ages.put(\"Alice\", 25);\n        \n        System.out.println(names.get(0) + \" is \" + ages.get(\"Alice\"));\n    }\n}",
            icon: Database,
            color: "#a855f7"
          }
        ]
      },
      {
        id: "ch-12-21",
        title: "Chapter 12-21 — Data Structures",
        concepts: [
          {
            id: "java-2-12-1",
            title: "Overview of DSA in Java",
            type: "concept",
            tldr: "Implementing core computer science structures manually in Java.",
            description: "To master algorithmic interviews, you must go beyond the standard Collections Framework and learn how to implement these structures from scratch:\n\n• **Searching/Sorting**: Binary Search, QuickSort, MergeSort.\n• **Linked Lists**: Node-based chained structures.\n• **Stacks & Queues**: LIFO and FIFO implementations.\n• **Trees & BSTs**: Hierarchical data querying.\n• **Graphs & Heaps**: Complex relational and priority systems.",
            code: "class Node {\n    int data;\n    Node next;\n    \n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\n// A manual Linked List implementation is standard practice in DSA rounds.\nclass LinkedList {\n    Node head;\n    // ... add, delete, traverse methods ...\n}",
            icon: Network,
            color: "#a855f7"
          }
        ],
        missions: [
          {
            id: "java-mission-intermediate-1",
            title: "Implement a Binary Search Tree",
            type: "practice",
            tldr: "Build a functioning BST with insert and search capabilities.",
            description: "Your task is to write a Java class that implements a Binary Search Tree (BST) from scratch.\n\n1. Define a `TreeNode` class with `left` and `right` pointers.\n2. Implement an `insert(int value)` method.\n3. Implement a `search(int value)` method that returns true if found.\n\n*Hint*: Use recursion for elegant tree traversal.",
            code: "class BST {\n    // Node class goes here\n    \n    public void insert(int val) {\n        // implementation\n    }\n    \n    public boolean search(int val) {\n        // implementation\n        return false;\n    }\n}",
            difficulty: "Intermediate",
            xpReward: 250,
            icon: TerminalSquare,
            color: "#a855f7"
          }
        ]
      }
    ]
  }
]
