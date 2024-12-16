import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const apiKey = process.env.AI_APIKEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const { query } = await req.json();
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `For the following C# code, generate only the exact console output that would be printed when running the code in .NET 8.0. 
Simulate Console.WriteLine(), Console.Write(), and any other console output methods. 
Do not include any additional explanatory text, just the raw console output:

\`\`\`csharp
${query}
\`\`\`

Console output:`
          }]
        }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
        }
    );

    // Extract only the console output
    const output = response.data.candidates[0].content.parts[0].text.trim();
    
    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: error.response?.data || 'Unknown error' 
    }, { status: 500 });
  }
}