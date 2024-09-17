'use client';

import { CircleUserRound } from 'lucide-react';
import { Input } from '../input';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      Please wait
    </Button>
  );
}

interface AssistantProps {
  isWriting: boolean;
  onHint: any;
}

const Assistant: React.FC<AssistantProps> = ({ isWriting, onHint }) => {
  const [question, setQuestion] = useState<string>('');

  const { sendLoading, hintLoading, setUserPrompt } = useAppContext();

  useEffect(() => {
    if (!sendLoading) setQuestion('');
  }, [sendLoading]);

  return (
    <div className='flex items-center justify-between gap-2 w-full'>
      <div className='basis-1/3 md:basis-[30%] lg:basis-[27%] shadow-md rounded-md items-center justify-between bg-white p-2  flex gap-2'>
        <Button variant='outline' size='icon'>
          <CircleUserRound color='green' />
        </Button>
        {question !== '' ? (
          <>
            {sendLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={(e: any) => {
                  setUserPrompt(question);
                }}
                className='ml-2 hover:bg-green-400 bg-green-500 font-semibold'
              >
                Send
              </Button>
            )}
          </>
        ) : (
          <>
            {hintLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={onHint}
                className='ml-2 hover:bg-green-400 bg-green-500 font-semibold'
              >
                Hint?
              </Button>
            )}
          </>
        )}
      </div>
      <div className='basis-2/3 shadow-md rounded-md bg-white p-2'>
        <Input
          className='w-full'
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          type='text'
          placeholder='Type your question here'
        />
      </div>
    </div>
  );
};

export { Assistant };
