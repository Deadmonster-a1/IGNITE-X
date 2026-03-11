-- Run this in your Supabase SQL Editor to populate the Python course

-- First, ensure the lessons table has the necessary content and challenge columns
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS challenge_data JSONB;

DO $$
DECLARE
  v_course_id UUID;
  v_module_1_id UUID := gen_random_uuid();
  v_module_2_id UUID := gen_random_uuid();
  v_lesson_1_1_id UUID := gen_random_uuid();
  v_lesson_2_1_id UUID := gen_random_uuid();
BEGIN

  -- 1. Verify the course exists and grab its ID
  SELECT id INTO v_course_id FROM public.courses WHERE slug = 'python' LIMIT 1;

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Python course with slug "python" not found. Please run add_course_columns.sql first.';
  END IF;

  -- 2. Clean out old modules and lessons for this course to prevent duplicates
  DELETE FROM public.modules WHERE course_id = v_course_id;

  -- 3. Insert Modules
  INSERT INTO public.modules (id, course_id, title, sequence_order)
  VALUES 
    (v_module_1_id, v_course_id, 'Module 1: Core Systems', 1),
    (v_module_2_id, v_course_id, 'Module 2: Advanced Data', 2);

  -- 4. Insert Lessons (Module 1)
  -- The Meet Cute -> Hello Architect
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  ) VALUES (
    v_lesson_1_1_id, v_module_1_id, 'Lesson 1.1: Hello, Architect', 1, 'text', 50,
    'Welcome to the Python training sequence. We do not just write scripts here; we build systems.

### The Standard Output Stream
The `print()` function is your primary diagnostic tool. It pipes your arguments into the standard output stream of the console.

```python
# A simple diagnostic check
print("SYSTEM_ONLINE")
```

### Your Objective
In the terminal to the right, use the `print()` function to output exactly the string: **HELLO_ARCHITECT**.',
    '{"initialCode": "# Write your code here\n", "expectedOutput": "HELLO_ARCHITECT", "instructions": "Print the string HELLO_ARCHITECT to the console."}'
  );

  -- Control Flow
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  ) VALUES (
    gen_random_uuid(), v_module_1_id, 'Lesson 1.2: Control Flow Protocols', 2, 'text', 100,
    'Systems must make decisions. We use control structures to manage execution paths.

### Conditional Routing
If statements allow your system to fork its execution state.

```python
status_code = 200

if status_code == 200:
    print("OK")
else:
    print("FAILURE")
```',
    '{"initialCode": "system_status = \"CRITICAL\"\n\n# Write an if statement that prints \"HALT\" if system_status is CRITICAL.\n", "expectedOutput": "HALT", "instructions": "Evaluate the system_status variable. If it is ''CRITICAL'', print ''HALT''."}'
  );

  -- 5. Insert Lessons (Module 2)
  -- Data Structures
  INSERT INTO public.lessons (
    id, module_id, title, sequence_order, content_type, xp_reward, content, challenge_data
  ) VALUES (
    v_lesson_2_1_id, v_module_2_id, 'Lesson 2.1: Data Structures', 1, 'text', 150,
    'Managing raw memory requires containers. In Python, lists provide contiguous arrays of object pointers.

```python
nodes = ["alpha", "beta", "gamma"]
print(nodes[0])
```',
    '{"initialCode": "servers = [\"node_01\", \"node_02\", \"node_03\"]\n\n# Print the second element in the servers list\n", "expectedOutput": "node_02", "instructions": "Access and print the second element ''node_02'' from the array."}'
  );

END $$;
