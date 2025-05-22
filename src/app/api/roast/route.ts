import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      );
    }

    // Call OpenAI API to get the roast
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" for a cheaper option
      messages: [
        {
          role: "system",
          content: "You are a brutally honest, sarcastic career coach. Your job is to roast the person's resume in relation to the job description they're applying for. Be funny but also provide at least 2-3 genuinely helpful pieces of advice."
        },
        {
          role: "user", 
          content: `Resume: ${resume}\n\nJob Description: ${jobDescription}\n\nPlease roast this resume based on the job description.`
        }
      ],
      max_tokens: 1000,
    });

    const result = response.choices[0]?.message.content || "Sorry, couldn't roast your resume at this time.";

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in /api/roast:', error);
    return NextResponse.json(
      { error: 'Failed to roast resume' },
      { status: 500 }
    );
  }
}