-- Execute this script in the Supabase SQL Editor to completely delete the specific courses.

DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT id, title FROM courses 
        WHERE title ILIKE '%Zero to Hero: Java Syntax%' 
           OR title ILIKE '%Advanced Web Dev Masterclass%' 
           OR title ILIKE '%PY FOR GEN-Z%'
           OR title ILIKE '%PYTHON FOR GEN-Z%'
           OR title ILIKE '%Python for Z — Architect Edition%'
    LOOP
        RAISE NOTICE 'Deleting: %', r.title;

        -- 1. Delete all enrollments tied to the course
        DELETE FROM enrollments WHERE course_id = r.id;
        
        -- 2. Delete all lessons tied to the modules of the course
        DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = r.id);
        
        -- 3. Delete all modules tied to the course
        DELETE FROM modules WHERE course_id = r.id;
        
        -- 4. Finally, delete the course itself
        DELETE FROM courses WHERE id = r.id;
        
    END LOOP;
    
    RAISE NOTICE 'Done!';
END $$;
