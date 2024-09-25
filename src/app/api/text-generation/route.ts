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
    request: 'initial' | 'hint' | 'user_prompt' | 'steps';
  };
  const data: Data = await request.json();
  if (data.message) {
    try {
      if (data.request === 'initial') {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Split the following text's exercises and return a JSON array 
                that for each exercise has an object that includes an exercise_name, 
                points,question, study_before_solving. Study before solving should be an
                array that includes the fields {name, explanation} for each topic that
                it's knowledge is required for the question to be solved.
                The explanation should adequately explain the knowledge required for the question
                to be solved and include an example of how to use the knowledge. 
                If there are no exercises, return an empty array.`,
            },
            { role: 'user', content: data.message },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
        });
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0].message);
      } else if (data.request === 'hint') {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'Give the user a hint on how to solve the following question without answering it. ',
            },
            { role: 'user', content: data.message },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'text' },
        });
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0].message.content);
      } else if (data.request == 'user_prompt') {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that answers questions based on the provided context.',
            },
            { role: 'user', content: data.message },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'text' },
        });
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0].message.content);
      } else if (data.request == 'steps') {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'Give the user short steps of the thought process without giving away the answer. Each step should be a string in a json array called steps.',
            },
            { role: 'user', content: data.message },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
        });
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0].message.content);
      } else if (data.request == 'video') {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'Create english text suitable for a video explanation of the following exercise. Make sure the text includes all the information required for the student to adequately solve the exercise without giving away the answer.',
            },
            { role: 'user', content: data.message },
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'text' },
        });
        console.log(completion.choices[0]);
        return NextResponse.json(completion.choices[0].message);
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error', error });
    }
  }
  return NextResponse.json({ message: 'No message or user provided' });
}
