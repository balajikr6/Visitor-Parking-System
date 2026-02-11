const BASE_URL = 'http://localhost:3000/api/auth';

async function debugLogin() {
    try {
        console.log('--- Debugging Login ---');

        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            console.log('Response Body:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('Response Body (Text):', text);
        }

    } catch (error) {
        console.error('Fetch Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

debugLogin();
