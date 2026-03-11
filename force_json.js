const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("Connected to PostgreSQL");

        const targetLesson = "Hello, Enterprise";
        
        // Use true JSON payload
        const payload = JSON.stringify({
            instructions: "Print HELLO_JAVA to the console.",
            initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}",
            expectedOutput: "HELLO_JAVA"
        });

        console.log("Updating lesson...");
        // Use direct parameter binding to force JSONB parse
        const res = await client.query(
            "UPDATE lessons SET content_type = 'interactive', challenge_data = $1::jsonb WHERE title ILIKE $2 RETURNING id, title, challenge_data",
            [payload, `%${targetLesson}%`]
        );

        console.log("Result:", JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        await client.end();
    }
}

run();
