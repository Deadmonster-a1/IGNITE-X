const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
    // Port 54322 is the local Supabase mapped port, but from inside the Docker or specific setups it might be 5432.
    // However, the user environment is Windows, so we use the URL directly from .env.local
    const connectionString = process.env.DATABASE_URL;
    
    const client = new Client({
        connectionString: connectionString
    });

    try {
        await client.connect();
        console.log('Connected to Database');
        
        console.log('Adding is_public column...');
        await client.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;');
        
        console.log('Adding streak_count column...');
        await client.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;');
        
        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
