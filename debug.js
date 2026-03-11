const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const { data: user } = await supabase.from('profiles').select('id, email').limit(1).single();
    if (!user) return console.log("No user found");

    console.log("Found user:", user);

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
        `)
        .eq('user_id', user.id);

    console.log("Enrollments:", JSON.stringify(enrollments, null, 2));

    const { data: progress } = await supabase.from('lesson_progress').select('*').eq('user_id', user.id);
    console.log("Progress:", JSON.stringify(progress, null, 2));
}

main();
