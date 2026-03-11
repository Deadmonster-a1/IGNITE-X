-- Create the three Java courses

DO $$
DECLARE
  v_course_beginner_id UUID := gen_random_uuid();
  v_course_intermediate_id UUID := gen_random_uuid();
  v_course_advanced_id UUID := gen_random_uuid();

  -- Beginner Modules & Lessons
  v_beg_mod_1_id UUID := gen_random_uuid();
  v_beg_mod_2_id UUID := gen_random_uuid();
  v_beg_lesson_1_1_id UUID := gen_random_uuid();
  v_beg_lesson_2_1_id UUID := gen_random_uuid();

  -- Intermediate Modules & Lessons
  v_int_mod_1_id UUID := gen_random_uuid();
  v_int_mod_2_id UUID := gen_random_uuid();
  v_int_lesson_1_1_id UUID := gen_random_uuid();
  v_int_lesson_2_1_id UUID := gen_random_uuid();

  -- Advanced Modules & Lessons
  v_adv_mod_1_id UUID := gen_random_uuid();
  v_adv_mod_2_id UUID := gen_random_uuid();
  v_adv_lesson_1_1_id UUID := gen_random_uuid();
  v_adv_lesson_2_1_id UUID := gen_random_uuid();

BEGIN

  -- 1. CLEANUP OLD COURSES (If they exist)
  DELETE FROM public.courses WHERE slug IN ('java-beginner', 'java-intermediate', 'java-advanced');

  -- 2. INSERT COURSES
  INSERT INTO public.courses (
    id, title, description, slug, difficulty, duration_hours, category, is_published, is_premium, thumbnail_url
  ) VALUES 
  (
    v_course_beginner_id, 
    'Zero to Hero: Java Syntax', 
    'Start here. Learn the absolute basics of Java, JVM, syntax, and compiling your first programs.',
    'java-beginner', 'Beginner', 10, 'Backend', true, false,
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop'
  ),
  (
    v_course_intermediate_id, 
    'Object Oriented Java', 
    'Next up: understand objects, classes, inheritance, and the Java Collections Framework (ArrayList, HashMap).',
    'java-intermediate', 'Intermediate', 20, 'Backend', true, false,
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2670&auto=format&fit=crop'
  ),
  (
    v_course_advanced_id, 
    'Enterprise Java Architecture', 
    'Master high-performance apps. We dive deep into Concurrency, Multithreading, memory management, and advanced compilation patterns.',
    'java-advanced', 'Advanced', 40, 'Backend', true, true,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop'
  );

  -- 3. INSERT MODULES
  INSERT INTO public.modules (id, course_id, title, sequence_order) VALUES 
  (v_beg_mod_1_id, v_course_beginner_id, 'Module 1: Hello World & The JVM', 1),
  (v_beg_mod_2_id, v_course_beginner_id, 'Module 2: Variables & Primitives', 2),

  (v_int_mod_1_id, v_course_intermediate_id, 'Module 1: Classes & Objects', 1),
  (v_int_mod_2_id, v_course_intermediate_id, 'Module 2: The Collections Framework', 2),

  (v_adv_mod_1_id, v_course_advanced_id, 'Module 1: Concurrency & Threads', 1),
  (v_adv_mod_2_id, v_course_advanced_id, 'Module 2: Compilation & Bytecode', 2);

  -- 4. INSERT LESSONS (BEGINNER)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_beg_lesson_1_1_id, v_beg_mod_1_id, 'Lesson 1.1: Hello, Enterprise', 1, 'text', 50,
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
    v_beg_lesson_2_1_id, v_beg_mod_2_id, 'Lesson 2.1: Typed Variables', 1, 'text', 100,
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

  -- 5. INSERT LESSONS (INTERMEDIATE)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_int_lesson_1_1_id, v_int_mod_1_id, 'Lesson 1.1: Object Orientation', 1, 'text', 150,
    'Everything in Java is an Object. You create blueprints called Classes to instantiate these objects in memory. Let''s print object attributes.',
    '{"initialCode": "class Server {\n    String name = \"Alpha Node\";\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a new Server object and print its name\n        \n    }\n}", "expectedOutput": "Alpha Node", "instructions": "Instantiate the Server class and print its `name` attribute."}',
    'Learn Class definitions and Object properties.'
  ),
  (
    v_int_lesson_2_1_id, v_int_mod_2_id, 'Lesson 2.1: Lists and the Collections Framework', 1, 'text', 150,
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
    '{"initialCode": "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> servers = new ArrayList<>();\n        servers.add(\"node_01\");\n        servers.add(\"node_02\");\n        servers.add(\"node_03\");\n        \n        // Print the second element in the servers list\n        \n    }\n}", "expectedOutput": "node_02", "instructions": "Access and print the second element \"node_02\" from the ArrayList."}',
    'Master dynamic arrays utilizing the Java Collections Framework.'
  );

  -- 6. INSERT LESSONS (ADVANCED)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_adv_lesson_1_1_id, v_adv_mod_1_id, 'Lesson 1.1: Threads & Concurrency', 1, 'text', 200,
    'Java has native support for multithreading. You can spawn multiple execution paths at the exact same time. Let''s see who prints faster!',
    '{"initialCode": "class Task extends Thread {\n    public void run() {\n        System.out.println(\"THREAD_ONLINE\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Task t1 = new Task();\n        // Start the thread below\n        \n    }\n}", "expectedOutput": "THREAD_ONLINE", "instructions": "Call the `start()` method on t1 to execute the Thread."}',
    'Dive deep into Java''s native Thread classes and runnable interfaces.'
  ),
  (
    v_adv_lesson_2_1_id, v_adv_mod_2_id, 'Lesson 2.1: The Java Compiler (javac)', 1, 'text', 200,
    'Java is a compiled language. Before the Java Virtual Machine (JVM) can run your code, it must be translated from human-readable `.java` files into machine-independent byte-code `.class` files.

### Your Architecture Check
The compiler enforces strict rules before your code ever runs. If a type is wrong, or a semicolon is missing, `javac` will throw an error and halt compilation. This guarantees a higher level of safety at runtime.

### Challenge Objective
Simulate the compilation step. You are given a program with a syntax error. Fix the syntax error (missing semicolon) so the "compiler" allows it to run.',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"COMPILER_READY\")\n    }\n}", "expectedOutput": "COMPILER_READY", "instructions": "Fix the syntax error in the code so it successfully compiles and runs."}',
    'Understand how javac compiles your code into byte-code for the JVM.'
  );

END $$;
