const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCourseFull(courseData) {
    // 1. Create Course
    const { data: course, error } = await supabase.from("courses").insert({
        title: courseData.title,
        description: courseData.description,
        slug: courseData.slug,
        difficulty: courseData.difficulty,
        duration_hours: courseData.duration_hours,
        is_premium: courseData.is_premium,
        thumbnail_url: courseData.thumbnail_url,
        is_published: true
    }).select("id").single();

    if (error) {
        console.error("Failed inserting course:", courseData.title, error);
        return;
    }

    const courseId = course.id;
    console.log("Created Course:", courseData.title, "-> ID:", courseId);

    // 2. Insert Modules and Lessons
    for (let m = 0; m < courseData.modules.length; m++) {
        const mod = courseData.modules[m];
        const { data: moduleData, error: modErr } = await supabase.from("modules").insert({
            course_id: courseId,
            title: mod.title,
            sequence_order: mod.sequence_order
        }).select("id").single();

        if (modErr) {
            console.error(" Failed Module:", mod.title, modErr);
            continue;
        }

        const moduleId = moduleData.id;
        console.log("  -> Created Module:", mod.title);

        for (let l = 0; l < mod.lessons.length; l++) {
            const lesson = mod.lessons[l];
            const { error: lessonErr } = await supabase.from("lessons").insert({
                module_id: moduleId,
                title: lesson.title,
                sequence_order: lesson.sequence_order,
                content_type: lesson.challenge_data ? "challenge" : "text",
                xp_reward: lesson.xp_reward,
                content: lesson.content,
                challenge_data: lesson.challenge_data ? JSON.stringify(lesson.challenge_data) : null,
                description: lesson.description
            });

            if (lessonErr) {
                console.error("    Failed Lesson:", lesson.title, lessonErr);
            } else {
                console.log("    -> Created Lesson:", lesson.title);
            }
        }
    }
}

async function run() {
    console.log("Cleaning up old java courses...");
    await supabase.from("courses").delete().ilike("title", "%Java%");

    console.log("Creating Beginner Java Course...");
    await createCourseFull({
        title: "Zero to Hero: Java Syntax",
        description: "Start here. Learn the absolute basics of Java, JVM, syntax, and compiling your first programs.",
        slug: "java-beginner",
        difficulty: "Beginner",
        duration_hours: 10,
        is_premium: false,
        thumbnail_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
        modules: [
            {
                title: "Module 1: Hello World & The JVM",
                sequence_order: 1,
                lessons: [
                    {
                        title: "Lesson 1.1: Hello, Enterprise",
                        sequence_order: 1,
                        xp_reward: 50,
                        description: "Your first introduction to Java syntax and the standard output stream.",
                        content: "Welcome to Java. This is not a scripting language; it is a statically typed, object-oriented language designed for massive enterprise systems.\n\n### The Entry Point\nEvery Java application starts at the `main` method. It is the core ignition switch for your system.\n\n```java\npublic class SystemInitializer {\n    public static void main(String[] args) {\n        System.out.println(\"SYSTEM_ONLINE\");\n    }\n}\n```\n\n### Your Objective\nIn the terminal to the right, output exactly the string: **HELLO_JAVA**.",
                        challenge_data: {
                            initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}",
                            expectedOutput: "HELLO_JAVA",
                            instructions: "Print the string HELLO_JAVA to the console using System.out.println."
                        }
                    }
                ]
            },
            {
                title: "Module 2: Variables & Primitives",
                sequence_order: 2,
                lessons: [
                    {
                        title: "Lesson 2.1: Typed Variables",
                        sequence_order: 1,
                        xp_reward: 100,
                        description: "Learn how to declare and use strictly typed variables.",
                        content: "Unlike Python or JavaScript, Java strictly enforces data types. You must declare exactly what kind of data a variable holds.\n\n### Primitive Types\n```java\nint port = 8080;\nboolean isSecure = true;\ndouble latency = 0.54;\n```",
                        challenge_data: {
                            initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Declare an int named statusCode and set it to 200\n        \n        // Print the statusCode\n        \n    }\n}",
                            expectedOutput: "200",
                            instructions: "Declare an integer named statusCode with the value 200, then print it."
                        }
                    }
                ]
            }
        ]
    });

    console.log("Creating Intermediate Java Course...");
    await createCourseFull({
        title: "Object Oriented Java",
        description: "Next up: understand objects, classes, inheritance, and the Java Collections Framework (ArrayList, HashMap).",
        slug: "java-intermediate",
        difficulty: "Intermediate",
        duration_hours: 20,
        is_premium: false,
        thumbnail_url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2670&auto=format&fit=crop",
        modules: [
            {
                title: "Module 1: Classes & Objects",
                sequence_order: 1,
                lessons: [
                    {
                        title: "Lesson 1.1: Object Orientation",
                        sequence_order: 1,
                        xp_reward: 150,
                        description: "Learn Class definitions and Object properties.",
                        content: "Everything in Java is an Object. You create blueprints called Classes to instantiate these objects in memory. Let's print object attributes.",
                        challenge_data: {
                            initialCode: "class Server {\n    String name = \"Alpha Node\";\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a new Server object and print its name\n        \n    }\n}",
                            expectedOutput: "Alpha Node",
                            instructions: "Instantiate the Server class and print its `name` attribute."
                        }
                    }
                ]
            },
            {
                title: "Module 2: The Collections Framework",
                sequence_order: 2,
                lessons: [
                    {
                        title: "Lesson 2.1: Lists and the Collections Framework",
                        sequence_order: 1,
                        xp_reward: 150,
                        description: "Master dynamic arrays utilizing the Java Collections Framework.",
                        content: "Managing raw memory requires powerful containers. In Java, we use the Collections Framework, specifically `ArrayList`, for dynamic arrays.\n\n```java\nimport java.util.ArrayList;\n\npublic class Manager {\n    public static void main(String[] args) {\n        ArrayList<String> nodes = new ArrayList<>();\n        nodes.add(\"alpha\");\n        nodes.add(\"beta\");\n        System.out.println(nodes.get(0));\n    }\n}\n```",
                        challenge_data: {
                            initialCode: "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> servers = new ArrayList<>();\n        servers.add(\"node_01\");\n        servers.add(\"node_02\");\n        servers.add(\"node_03\");\n        \n        // Print the second element in the servers list\n        \n    }\n}",
                            expectedOutput: "node_02",
                            instructions: "Access and print the second element \"node_02\" from the ArrayList."
                        }
                    }
                ]
            }
        ]
    });

    console.log("Creating Advanced Java Course...");
    await createCourseFull({
        title: "Enterprise Java Architecture",
        description: "Master high-performance apps. We dive deep into Concurrency, Multithreading, memory management, and advanced compilation patterns.",
        slug: "java-advanced",
        difficulty: "Advanced",
        duration_hours: 40,
        is_premium: true,
        thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
        modules: [
            {
                title: "Module 1: Concurrency & Threads",
                sequence_order: 1,
                lessons: [
                    {
                        title: "Lesson 1.1: Threads & Concurrency",
                        sequence_order: 1,
                        xp_reward: 200,
                        description: "Dive deep into Java's native Thread classes and runnable interfaces.",
                        content: "Java has native support for multithreading. You can spawn multiple execution paths at the exact same time. Let's see who prints faster!",
                        challenge_data: {
                            initialCode: "class Task extends Thread {\n    public void run() {\n        System.out.println(\"THREAD_ONLINE\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Task t1 = new Task();\n        // Start the thread below\n        \n    }\n}",
                            expectedOutput: "THREAD_ONLINE",
                            instructions: "Call the `start()` method on t1 to execute the Thread."
                        }
                    }
                ]
            },
            {
                title: "Module 2: Compilation & Bytecode",
                sequence_order: 2,
                lessons: [
                    {
                        title: "Lesson 2.1: The Java Compiler (javac)",
                        sequence_order: 1,
                        xp_reward: 200,
                        description: "Understand how javac compiles your code into byte-code for the JVM.",
                        content: "Java is a compiled language. Before the Java Virtual Machine (JVM) can run your code, it must be translated from human-readable `.java` files into machine-independent byte-code `.class` files.\n\n### Your Architecture Check\nThe compiler enforces strict rules before your code ever runs. If a type is wrong, or a semicolon is missing, `javac` will throw an error and halt compilation. This guarantees a higher level of safety at runtime.\n\n### Challenge Objective\nSimulate the compilation step. You are given a program with a syntax error. Fix the syntax error (missing semicolon) so the \"compiler\" allows it to run.",
                        challenge_data: {
                            initialCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"COMPILER_READY\")\n    }\n}",
                            expectedOutput: "COMPILER_READY",
                            instructions: "Fix the syntax error in the code so it successfully compiles and runs."
                        }
                    }
                ]
            }
        ]
    });

    console.log("All courses successfully seeded directly via Supabase API!");
}

run();
