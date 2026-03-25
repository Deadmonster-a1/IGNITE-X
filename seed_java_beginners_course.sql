-- Run this in your Supabase SQL Editor to populate the Java for Beginners course

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
  
  v_lesson_1_1_id UUID := gen_random_uuid();
  v_lesson_1_2_id UUID := gen_random_uuid();
  v_lesson_2_1_id UUID := gen_random_uuid();
  v_lesson_2_2_id UUID := gen_random_uuid();
BEGIN

  -- 1. Check if course already exists, if so grab its ID instead of using the new one
  SELECT id INTO v_course_id FROM public.courses WHERE slug = 'java-for-beginners' LIMIT 1;

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
    'Java for Beginners', 
    'Start your programming journey here. Learn the absolute basics of Java, programming concepts, and logic building.',
    'java-for-beginners',
    'Beginner',
    10,
    'Backend',
    true,
    false,
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop'
  );

  -- 4. Insert Modules
  INSERT INTO public.modules (id, course_id, title, sequence_order)
  VALUES 
    (v_module_1_id, v_course_id, 'Module 1: Introduction to Programming', 1),
    (v_module_2_id, v_course_id, 'Module 2: Control Flow', 2);

  -- 5. Insert Lessons (Module 1 - Introduction to Programming)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_lesson_1_1_id, v_module_1_id, 'Lesson 1.1: Your First Program', 1, 'text', 10,
    'Welcome to the programming world! We''ll start with the classic "Hello World" program.
    
In Java, every program must be wrapped in a `class`, and execution always begins in the `main` method.

`System.out.println` is the command used to print output to the console.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        // Print Hello, Beginner! below\n        \n    }\n}", "expectedOutput": "Hello, Beginner!", "instructions": "Print the string Hello, Beginner! to the console using System.out.println."}',
    'Write your very first Java program and say hello to the world.'
  ),
  (
    v_lesson_1_2_id, v_module_1_id, 'Lesson 1.2: Variables and Data', 2, 'text', 20,
    'Variables are like boxes that store data. In Java, you must declare what type of data a box can hold.

- `int` holds whole numbers (integers).
- `double` holds decimal numbers.
- `String` holds text (must use double quotes `" "`).
- `boolean` holds `true` or `false`.

```java
int score = 100;
String defaultName = "Player One";
boolean isGameOver = false;
```',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        // Create an integer variable named ''age'' and assign a value to it.\n        \n        // Print the age variable\n        \n    }\n}", "expectedOutput": "25", "instructions": "Create an integer named ''age'' with the value 25 and print it."}',
    'Learn how to store different types of data in variables.'
  );

  -- 6. Insert Lessons (Module 2 - Control Flow)
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data, description
  ) VALUES (
    v_lesson_2_1_id, v_module_2_id, 'Lesson 2.1: If/Else Statements', 1, 'text', 30,
    'Programs need to make decisions. The `if` statement evaluates a condition, and executes code only if the condition is true. `else` is used as a fallback.

```java
int temperature = 25;

if (temperature > 30) {
    System.out.println("It is hot");
} else {
    System.out.println("It is nice");
}
```',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        int myScore = 85;\n        // Write an if statement to print \"Pass\" if myScore is 60 or higher.\n        // Note: The challenge tests for the exact output \"Pass\".\n\n    }\n}", "expectedOutput": "Pass", "instructions": "Use an if statement to print ''Pass'' if the score is greater than or equal to 60."}',
    'Teach your program how to make basic decisions.'
  ),
  (
    v_lesson_2_2_id, v_module_2_id, 'Lesson 2.2: Loops (For Loop)', 2, 'text', 30,
    'Loops allow you to run the same code multiple times, without copying and pasting it.

The `for` loop is great when you know exactly how many times you want to loop.

```java
// This will print the numbers 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```
**Breakdown**:
1. `int i = 1`: Start at 1.
2. `i <= 5`: Keep going as long as `i` is less than or equal to 5.
3. `i++`: Increase `i` by 1 after every loop.',
    '{"initialCode": "public class Main {\n    public static void main(String[] args) {\n        // Create a for loop that prints the word \"Java\" exactly 3 times\n\n    }\n}", "expectedOutput": "Java\nJava\nJava", "instructions": "Use a for loop to print the word ''Java'' on 3 separate lines."}',
    'Learn how to repeat actions efficiently using loops.'
  );

END $$;
