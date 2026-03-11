const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const sql = fs.readFileSync('seed_3_java_courses.sql', 'utf8');

async function run() {
  console.log('Executing seed_3_java_courses.sql...');
  
  // We can't easily execute raw SQL via supabase-js without an RPC. 
  // Let's check if `exec_sql` exists or if we should just use the REST API manually if needed.
  // Many supabase projects have an `exec_sql` helper installed.
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.error('RPC failed, falling back to attempting individual table inserts or manual copy-paste is required.', error);
    process.exit(1);
  }
  
  console.log('Success:', data);
}

run();
