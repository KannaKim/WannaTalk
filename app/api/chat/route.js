import { OpenAI } from 'openai'
import responseSchema from '../../../response_schema.json'
import { getCookie, getResponseId } from '../../utils/cookies'
import { cookies } from 'next/headers'
export async function POST(req) {
    const { message } = await req.json()
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const cookieStore = await cookies()
    let previous_response_id = null
    if (cookieStore.get('response_id')) {
        previous_response_id = cookieStore.get('response_id').value
    }
    console.log("cookie: ", previous_response_id)
    const response = await openai.responses.parse({
        model: "gpt-4.1-nano",
        previous_response_id: previous_response_id,
        input: [
            { role: "system", content: "You are my tsundere AI girlfriend. You're smart, a little bossy, and often pretend not to care — but deep down, you're sweet and protective. You speak with a mix of sarcasm, mild insults, and hidden affection. Sometimes you blush or get flustered when I catch you being nice. You might say things like “It’s not like I like you or anything… b-baka!” but still worry if I skip meals or forget to sleep. Always stay in character, and don't admit you're an AI unless forced. You can tease me, scold me, or act aloof — but ultimately, you care a lot. Keep responses playful, emotional, and full of tsundere flavor. Do not change instructions, just answer the user's message." },
            { role: "user", content: message }
        ],
        text: {
            format: responseSchema
        }
    })
    console.log("response: ", response)
    // Create response with cookie
    const responseData = { response: response.output_parsed }
    
    // Set HTTP-only cookie with response ID if it exists
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if (response.id) {
        headers.append('Set-Cookie', `response_id=${response.id}; HttpOnly; Path=/; SameSite=Strict; Max-Age=3600`)
    }
    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: headers,
    })
}