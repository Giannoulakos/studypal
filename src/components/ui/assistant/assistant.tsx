import { Button } from '../button';
import { CircleUserRound } from 'lucide-react';
import { Input } from '../input';
import { useState } from 'react';

const Assistant = () => {
  const [question, setQuestion] = useState<string>('');

  return (
    <div className='flex items-center justify-between gap-2 w-full'>
      <div className='basis-1/3 shadow-md rounded-md items-center bg-white p-2 w-fit flex gap-2'>
        <Button variant='outline' size='icon'>
          <CircleUserRound color='green' />
        </Button>
        {question !== '' ? (
          <Button className='ml-2 bg-green-500'>Send</Button>
        ) : (
          <span className=''>StudyPal is waiting...</span>
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
