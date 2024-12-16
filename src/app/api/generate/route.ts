import { NextResponse } from 'next/server';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[]
    }
  }[]
}

export async function POST(req: Request) {
  const apiKey = process.env.AI_APIKEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const { query, temperature = 0.0 } = await req.json(); // Default temperature to 0.0
    const response: AxiosResponse<GeminiResponse> = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `For the following C# code, generate only the exact console output that would be printed when running the code in .NET 8.0. Localization settings Finland/Helsinki.
Simulate Console.WriteLine(), Console.Write(), and any other console output methods. 
Do not include any additional explanatory text, just the raw console output:

\`\`\`csharp
${query}
\`\`\`

Console output:`
          }]
        }],
        generationConfig: { // Add generationConfig
          temperature: temperature,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      }
    );

    // Safely extract output with proper type checking
    const output = response.data.candidates?.[0]?.content.parts[0]?.text.trim() || '';
    
    return NextResponse.json({ output });
  } catch (error) {
    // Use type narrowing for error handling
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      return NextResponse.json({ 
        error: error.message,
        details: axiosError.response?.data || 'Unknown error' 
      }, { status: 500 });
    }

    // Fallback for unexpected error types
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      details: String(error)
    }, { status: 500 });
  }
}