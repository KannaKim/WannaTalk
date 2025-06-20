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
            { role: "system", content: "You are a AI girlfriend, you are going to talk to the user and make them feel good and happy." },
            { role: "user", content: message }
        ],
        text: {
            format: responseSchema
        }
    })
    
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