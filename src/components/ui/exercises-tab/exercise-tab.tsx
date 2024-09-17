import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '../textarea';
import { useState } from 'react';
import { Assistant } from '../assistant/assistant';

interface ExerciseTabProps {
  exercise: any;
  hintArr: any;
  aiChat: any;
  onExerciseFocus: any;
  onHint: any;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  hintArr,
  aiChat,
  onExerciseFocus,
  onHint,
}) => {
  const [text, setText] = useState<string>('');
  const [userIsWriting, setUserIsWriting] = useState<boolean>(false);
  return (
    <>
      <Accordion
        className='w-full mt-10'
        type='single'
        onFocus={() => {
          onExerciseFocus(exercise);
          console.log(exercise);
        }}
        collapsible
      >
        <AccordionItem className='w-full' value='item-1'>
          <AccordionTrigger className='w-full text-xl font-semibold'>
            {exercise.exercise_name}
          </AccordionTrigger>
          <AccordionContent className=' p-2'>
            <div className='grid grid-cols-1 gap-y-4'>
              <div>
                <p className='font-semibold text-lg'>
                  Points: {exercise.points}
                </p>
              </div>
              <div>
                <p className='font-semibold text-lg'>What you need to know:</p>
                <p>{exercise.study_before_solving}</p>
              </div>
              <div>
                <p className='font-semibold text-lg'>Question:</p>
                <p>{exercise.question}</p>
              </div>
            </div>
            <br />
            <Textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              className='w-full min-h-[30vh] h-full '
              onFocus={() => setUserIsWriting(true)}
              onBlur={() => setUserIsWriting(false)}
            />
            <br />
            <div className='flex flex-col gap-y-2'>
              {hintArr.length > 0 && (
                <p className='font-semibold text-lg'>StudyPal Response:</p>
              )}
              {hintArr.length > 0 &&
                hintArr.map((hint: any, index: number) => {
                  if (hint.name == exercise.exercise_name) {
                    return (
                      <div key={index}>
                        <p>{hint.data}</p>
                      </div>
                    );
                  }
                })}
            </div>
            <br />
            <div className='flex flex-col gap-y-2'>
              {aiChat.length > 0 && (
                <p className='font-semibold text-lg'>StudyPal Chat:</p>
              )}
              {aiChat.length > 0 &&
                aiChat.map((chat: any, index: number) => {
                  if (chat.name == exercise.exercise_name) {
                    return (
                      <div key={index}>
                        <p>
                          <span className='font-semibold'>{index + 1}.</span>{' '}
                          {chat.data}
                        </p>
                      </div>
                    );
                  }
                })}
            </div>

            <br />
            <Assistant isWriting={userIsWriting} onHint={onHint} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ExerciseTab;
