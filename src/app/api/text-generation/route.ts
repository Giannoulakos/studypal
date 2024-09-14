import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '../../../../utils/supabase/server';

export async function POST(request: Request, context: any) {
  const openai = new OpenAI();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  type Data = {
    message: string;
  };
  const data: Data = await request.json();
  if (data.message && user) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              "Split the following text's exercises and return a JSON array that for each exercise has an object that includes an exercise_name, points,question, study_before_solving. Study before solving should include the knowledge required for the question to be solved. If there are no exercises, return an empty array.",
          },
          { role: 'user', content: data.message },
        ],
        model: 'gpt-3.5-turbo',
        response_format: { type: 'json_object' },
      });
      console.log(completion.choices[0]);
      return NextResponse.json(completion.choices[0].message.content);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error', error });
    }
  }
  return NextResponse.json({ message: 'No message or user provided' });
}
