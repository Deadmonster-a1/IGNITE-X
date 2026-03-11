import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase
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

    console.log(JSON.stringify(data, null, 2));
}
main();
