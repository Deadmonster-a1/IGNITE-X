const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // 1. Get all enrollments
    const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
            id, status, user_id,
            course:courses (
                id, title, thumbnail, is_premium, premium_tier,
                modules (
                    lessons (id)
                )
            )
        `);

    console.log("Enrollments:", JSON.stringify(enrollments, null, 2));
    if (enrollError) console.error("EnrollError:", enrollError);

    // 2. Get lesson_progress
    const { data: progress, error: progError } = await supabase
        .from('lesson_progress')
        .select('*');

    console.log("Progress:", JSON.stringify(progress, null, 2));
    if (progError) console.error("ProgError:", progError);
}

main();
