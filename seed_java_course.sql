-- Run this in your Supabase SQL Editor to populate the Java architecture course

-- First, ensure the lessons table has the necessary content and challenge columns
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS challenge_data JSONB;

DO $$
DECLARE
  v_course_id UUID := gen_random_uuid();
  v_module_1_id UUID := gen_random_uuid();
  v_module_2_id UUID := gen_random_uuid();
  v_module_3_id UUID := gen_random_uuid();
  
  v_lesson_1_1_id UUID := gen_random_uuid();
  v_lesson_1_2_id UUID := gen_random_uuid();
  v_lesson_2_1_id UUID := gen_random_uuid();
  v_lesson_3_1_id UUID := gen_random_uuid();
BEGIN

  -- 1. Check if course already exists, if so grab its ID instead of using the new one
  SELECT id INTO v_course_id FROM public.courses WHERE slug = 'java' LIMIT 1;

  -- 2. Clean out old modules and lessons for this course to prevent duplicates
  IF v_course_id IS NOT NULL THEN
    DELETE FROM public.modules WHERE course_id = v_course_id;
    -- Also delete the course itself to recreate it fresh
    DELETE FROM public.courses WHERE id = v_course_id;
  END IF;

  -- Generate a fresh ID for the course
  v_course_id := gen_random_uuid();

  -- 3. Insert Course
  INSERT INTO public.courses (
    id, title, description, slug, difficulty, duration_hours, category, is_published, is_premium, thumbnail_url
  ) VALUES (
    v_course_id, 
    'Java Architecture', 
    'Master enterprise-grade backend systems. From Core Java syntax to multithreading, collections, and compiling real systems.',
    'java',
    'Beginner to Advanced',
    40,
    'Backend',
    true,
    true,
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop'
  );

  -- 4. Insert Modules
  INSERT INTO public.modules (id, course_id, title, sequence_order)
  VALUES 
    (v_module_1_id, v_course_id, 'Module 1: Core Syntax (Beginner)', 1),
    (v_module_2_id, v_course_id, 'Module 2: Memory & Objects (Intermediate)', 2),
    (v_module_3_id, v_course_id, 'Module 3: Execution & Compilation (Advanced)', 3);

  -- 5. Insert Lessons (Module 1 - Beginner)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_lesson_1_1_id, v_module_1_id, 'Lesson 1.1: Hello, Enterprise', 1, 'text', 50,
    'Welcome to Java. This is not a scripting language; it is a statically typed, object-oriented language designed for massive enterprise systems.

### The Entry Point
Every Java application starts at the `main` method. It is the core ignition switch for your system.

```java
public class SystemInitializer {
    public static void main(String[] args) {
        System.out.println("SYSTEM_ONLINE");
    }
}
```

### Your Objective
In the terminal to the right, output exactly the string: **HELLO_JAVA**.',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}", "expectedOutput": "HELLO_JAVA", "instructions": "Print the string HELLO_JAVA to the console using System.out.println."}',
    'Your first introduction to Java syntax and the standard output stream.'
  ),
  (
    v_lesson_1_2_id, v_module_1_id, 'Lesson 1.2: Typed Variables', 2, 'text', 100,
    'Unlike Python or JavaScript, Java strictly enforces data types. You must declare exactly what kind of data a variable holds.

### Primitive Types
```java
int port = 8080;
boolean isSecure = true;
double latency = 0.54;
```',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        // Declare an int named statusCode and set it to 200\n        \n        // Print the statusCode\n        \n    }\n}", "expectedOutput": "200", "instructions": "Declare an integer named statusCode with the value 200, then print it."}',
    'Learn how to declare and use strictly typed variables.'
  );

  -- 6. Insert Lessons (Module 2 - Intermediate)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_lesson_2_1_id, v_module_2_id, 'Lesson 2.1: The Collections Framework', 1, 'text', 150,
    'Managing raw memory requires powerful containers. In Java, we use the Collections Framework, specifically `ArrayList`, for dynamic arrays.

```java
import java.util.ArrayList;

public class Manager {
    public static void main(String[] args) {
        ArrayList<String> nodes = new ArrayList<>();
        nodes.add("alpha");
        nodes.add("beta");
        System.out.println(nodes.get(0));
    }
}
```',
    '{"initialCode": "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> servers = new ArrayList<>();\n        servers.add(\"node_01\");\n        servers.add(\"node_02\");\n        servers.add(\"node_03\");\n        \n        // Print the second element in the servers list\n        \n    }\n}", "expectedOutput": "node_02", "instructions": "Access and print the second element ''node_02'' from the ArrayList."}',
    'Master dynamic arrays utilizing the Java Collections Framework.'
  );

  -- 7. Insert Lessons (Module 3 - Advanced)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_lesson_3_1_id, v_module_3_id, 'Lesson 3.1: The Java Compiler (javac)', 1, 'text', 200,
    'Java is a compiled language. Before the Java Virtual Machine (JVM) can run your code, it must be translated from human-readable `.java` files into machine-independent byte-code `.class` files.

### The Two-Step Process

1. **Compile**: Convert source code to byte-code.
   `javac MyProgram.java`
   *This creates a `MyProgram.class` file.*

2. **Execute**: Run the byte-code on the JVM.
   `java MyProgram`

### Your Architecture Check
The compiler enforces strict rules before your code ever runs. If a type is wrong, or a semicolon is missing, `javac` will throw an error and halt compilation. This guarantees a higher level of safety at runtime.

### Challenge Objective
Simulate the compilation step. You are given a program with a syntax error. Fix the syntax error (missing semicolon) so the "compiler" allows it to run.',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"COMPILER_READY\")\n    }\n}", "expectedOutput": "COMPILER_READY", "instructions": "Fix the syntax error in the code so it successfully compiles and runs."}',
    'Understand how javac compiles your code into byte-code for the JVM.'
  );

END $$;
