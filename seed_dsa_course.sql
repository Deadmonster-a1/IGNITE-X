-- Run this in your Supabase SQL Editor to populate the new DSA course

DO $$
DECLARE
  v_course_id UUID := gen_random_uuid();
  v_module_1_id UUID := gen_random_uuid();
  v_lesson_1_1_id UUID := gen_random_uuid();
  v_lesson_1_2_id UUID := gen_random_uuid();
  v_lesson_1_3_id UUID := gen_random_uuid();
  v_lesson_1_4_id UUID := gen_random_uuid();
BEGIN
  -- 1. Insert Course
  -- Note: Depending on your exact schema, slug might be needed. If slug exists, add it here.
  -- Based on the schema provided, courses table has id, title, description, thumbnail, is_published, is_premium, premium_tier, is_deleted, created_by
  INSERT INTO public.courses (id, title, description, is_published, is_premium)
  VALUES (
    v_course_id, 
    'DSA for Detectives', 
    'To upgrade your training as a rookie detective, we must move beyond just knowing names and start understanding the DNA of computing.', 
    true, 
    false
  );

  -- 2. Insert Module 1
  INSERT INTO public.modules (id, course_id, title, sequence_order)
  VALUES (v_module_1_id, v_course_id, 'Module 1: The DNA of Computing', 1);

  -- 3. Insert Lessons
  
  -- Lesson 1.1: What is a "Data Structure"?
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  )
  VALUES (
    v_lesson_1_1_id, v_module_1_id, 'Lesson 1.1: What is a "Data Structure"?', 1, 'text', 50,
    'In the simplest terms, a **Data Structure** is a specialized container for your data. It’s not just about *storing* information; it’s about *how* you organize it so you can find what you need without breaking a sweat.

* **The Physical Concept:** Imagine you have 10,000 physical files from a crime scene.
* **Bad Data Structure:** You throw them all in a massive pile. If the Chief asks for a specific fingerprint report, you have to search the whole pile one by one. This is slow and inefficient.
* **Good Data Structure:** You put them in a filing cabinet, sorted by date and crime type. Now, you can find that report in seconds because you know exactly which drawer to open.

* **The Digital Reality:** Computers need different "containers" for different tasks.
* **Arrays:** A row of lockers where every item has a fixed number (index). Perfect for when you know the "address" of your data.
* **Stacks:** A pile of evidence photos. You can only take the one from the very top (LIFO - Last In, First Out). Think of the "Undo" button in your favorite app.
* **Queues:** A line at a precinct. The first person in is the first person served (FIFO - First In, First Out). Think of a printer handling documents.',
    '{"initialCode": "# Arrays are like lockers\nlockers = [\"Evidence A\", \"Evidence B\"]\n", "expectedOutput": "Evidence A", "instructions": "Print the first evidence from the lockers array."}'
  );

  -- Lesson 1.2: What is an "Algorithm"?
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  )
  VALUES (
    v_lesson_1_2_id, v_module_1_id, 'Lesson 1.2: What is an "Algorithm"?', 2, 'text', 50,
    'An **Algorithm** is a step-by-step instruction manual to solve a specific problem. It takes an **input** (the evidence), processes it through **logic** (the detective''s brain), and gives an **output** (the solved case).

* **The "Secret Sauce":** For an instruction to be an algorithm, it must be:
1. **Clear (Unambiguous):** Every step must be easy to follow. A computer can''t guess what you mean.
2. **Finite:** It must eventually end. A plan that loops forever is a failed investigation.
3. **Feasible:** Every step must be possible to perform with the tools you have.

* **A Real-World Example (Finding a Suspect):**
* **Step 1:** Get the list of all citizens in the city.
* **Step 2:** Filter by people who were near the crime scene at 10 PM.
* **Step 3:** From that list, find anyone who owns a blue van.
* **Step 4:** The remaining name is your prime suspect.',
    '{"initialCode": "# Algorithm to find a blue van owner\nsuspects = [{\"name\": \"Alice\", \"van\": \"red\"}, {\"name\": \"Bob\", \"van\": \"blue\"}]\n", "expectedOutput": "Bob", "instructions": "Write code to find and print the name of the suspect who owns a blue van."}'
  );

  -- Lesson 1.3: The Golden Equation
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  )
  VALUES (
    v_lesson_1_3_id, v_module_1_id, 'Lesson 1.3: The Golden Equation & Scaling', 3, 'text', 50,
    'A famous computer scientist once said:

> **Programs = Data Structures + Algorithms**

Think of it like building a house. The **Data Structures** are your materials (bricks, wood, glass), and the **Algorithms** are the blueprints (the plan for how to put them together). You can''t have a functional house without both.

### 🚀 Phase 4: Why Does Everyone Care About DSA?

If you are a beginner, you might wonder: *"Why not just write simple code?"* The answer is **Scalability**.

1. **Time Complexity (Speed):** A bad algorithm might take 1 second to search 10 files. But for Google, which searches billions of pages, that same bad algorithm would take 100 years! DSA teaches you to use **Big O Notation** to ensure your code stays fast even as data grows.
2. **Space Complexity (Memory):** Your phone has limited memory. A good data structure ensures your app doesn''t "hog" all the RAM and crash the system.
3. **The Professional Standard:** Tech giants use DSA to test your **problem-solving DNA**. They want to see how you think and optimize.',
    '{"initialCode": "# Programs = Data Structures + Algorithms\nprint(\"Understood\")\n", "expectedOutput": "Understood", "instructions": "Print ''Understood'' to confirm you know the golden equation."}'
  );

  -- Lesson 1.4: How to Learn
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  )
  VALUES (
    v_lesson_1_4_id, v_module_1_id, 'Lesson 1.4: How to Learn (The Polyglot Path)', 4, 'text', 50,
    'To master this, you shouldn''t just memorize code. You should understand the **Logic** first.

* **Step 1: The Concept:** Understand how a "Stack" works using a deck of cards or a stack of plates.
* **Step 2: The Implementation:** Write the logic in **Python** (to understand the flow), then **Java** (to see how systems handle it), then **C++** (to see how the computer''s memory actually works).
* **Step 3: Dry Run:** Grab a pen and paper. Trace the data moving through your steps. If you can''t draw the "crime scene," you don''t understand the case yet!

**Are you ready to enter the field?**',
    '{"initialCode": "ready = True\n# Print ''READY'' if ready is True\n", "expectedOutput": "READY", "instructions": "Print ''READY'' to enter the field."}'
  );

END $$;
