// Test script to verify API response
import fetch from 'node-fetch';

async function testAPI() {
    try {
        console.log('Testing /api/generate-session...');

        const response = await fetch('http://localhost:3001/api/generate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: 'greeting a friend',
                difficulty: 'Beginner'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            return;
        }

        const data = await response.json();
        console.log('\n✅ API Response:');
        console.log(JSON.stringify(data, null, 2));

        // Validate response
        console.log('\n📊 Validation:');
        console.log('- Has topic:', !!data.topic);
        console.log('- Has scenario:', !!data.scenario);
        console.log('- Has sentences:', Array.isArray(data.sentences));
        console.log('- Sentence count:', data.sentences?.length || 0);

        if (data.sentences && data.sentences.length > 0) {
            const firstSentence = data.sentences[0];
            console.log('\n📝 First sentence check:');
            console.log('- Has id:', !!firstSentence.id);
            console.log('- Has text:', !!firstSentence.text);
            console.log('- Has ipa:', !!firstSentence.ipa);
            console.log('- Has translation:', !!firstSentence.translation);
            console.log('- Has note:', !!firstSentence.note);
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAPI();
